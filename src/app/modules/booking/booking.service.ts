/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Booking } from "./booking.model";

import { IBooking, BookingStatus, PaymentStatus } from "./booking.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Package } from "../package/package.model";
import { bookingSearchableFields } from "./booking.constant";






//createBooking: সিট খালি আছে কিনা চেক করা, নতুন বুকিং তৈরি করা এবং availableSeats কমিয়ে ফেলা 

const createBooking = async (payload: IBooking) => {
  // Start transaction to ensure seat-consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Load package and check availability
    const pkg = await Package.findById(payload.package).session(session);
    if (!pkg) throw new Error("Package not found.");

    // If capacity defined, check
    if (pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
      if (pkg.availableSeats < (payload.pax || 1)) {
        throw new Error("Not enough available seats for this package.");
      }
      // decrement available seats
      pkg.availableSeats = (pkg.availableSeats || 0) - (payload.pax || 1);
      await pkg.save({ session });
    }

    // Create booking
    const booking = await Booking.create([payload], { session });
    await session.commitTransaction();
    session.endSession();

    // booking is returned as array due to create([..])
    return booking[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

//getAllBookings: অ্যাডমিনের জন্য সব বুকিংয়ের লিস্ট বের করা
const getAllBookings = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(Booking.find().populate("member", "name email").populate("package", "title slug"), query);
  const bookingsQuery = qb.search(bookingSearchableFields).filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([bookingsQuery.build(), qb.getMeta()]);
  return { data, meta };
};

//getSingleBooking: id দিয়ে নির্দিষ্ট একটি বুকিং খুঁজে বের করা
const getSingleBooking = async (id: string) => {
  const booking = await Booking.findById(id).populate("member", "name email phone").populate("package", "title slug costFrom");
  if (!booking) throw new Error("Booking not found.");
  return booking;
};
//  getMemberBookings: একজন নির্দিষ্ট ইউজারের বুকিংগুলো বের করা
const getMemberBookings = async (memberId: string, query: Record<string, string>) => {
  const qb = new QueryBuilder(Booking.find({ member: memberId }).populate("package", "title slug costFrom"), query);
  const bookingsQuery = qb.search(bookingSearchableFields).filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([bookingsQuery.build(), qb.getMeta()]);
  return { data, meta };
};

// updateBookingStatus: অ্যাডমিন দ্বারা স্ট্যাটাস পরিবর্তন করা (এবং সেই অনুযায়ী সিট সংখ্যা বাড়ানো বা কমানো হ্যান্ডেল করা)
const updateBookingStatus = async (id: string, payload: Partial<IBooking>) => {
  // If changing status to CANCELLED and booking was PAID -> set to REFUNDED (payment handling external)
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found.");

  const prevStatus = booking.status;
  const prevPaymentStatus = booking.paymentStatus;

  // Handle seat adjust when cancelling or confirming
  if (payload.status === BookingStatus.CANCELLED && prevStatus !== BookingStatus.CANCELLED) {
    // increment seats back
    const pkg = await Package.findById(booking.package);
    if (pkg && pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
      pkg.availableSeats = (pkg.availableSeats || 0) + (booking.pax || 1);
      await pkg.save();
    }

    // mark payment status -> REFUNDED if previously PAID (actual refund call is external)
    if (booking.paymentStatus === PaymentStatus.PAID) {
      booking.paymentStatus = PaymentStatus.REFUNDED;
    }
  }

  if (payload.status === BookingStatus.CONFIRMED && prevStatus !== BookingStatus.CONFIRMED) {
    // nothing to do for seats if already decremented at booking creation
  }

  // apply updates
  booking.status = (payload.status as BookingStatus) || booking.status;
  if (payload.paymentStatus) booking.paymentStatus = payload.paymentStatus as PaymentStatus;
  if ((payload as any).transactionId) booking.transactionId = (payload as any).transactionId;
  if ((payload as any).notes) booking.notes = (payload as any).notes;

  await booking.save();
  return booking;
};

// cancelBookingByUser: ইউজার নিজেই যদি বুকিং বাতিল করে, তাহলে সেই হ্যান্ডেল করা 
const cancelBookingByUser = async (id: string, memberId: string) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found.");
  if (booking.member.toString() !== memberId.toString()) throw new Error("Unauthorized.");

  if (booking.status === BookingStatus.CANCELLED) throw new Error("Booking already cancelled.");

  // increment seats
  const pkg = await Package.findById(booking.package);
  if (pkg && pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
    pkg.availableSeats = (pkg.availableSeats || 0) + (booking.pax || 1);
    await pkg.save();
  }

  booking.status = BookingStatus.CANCELLED;

  // if paid then mark refund state; actual refund call to payment gateway should be done elsewhere (e.g., PaymentService)
  if (booking.paymentStatus === PaymentStatus.PAID) booking.paymentStatus = PaymentStatus.REFUNDED;

  await booking.save();
  return booking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getMemberBookings,
  updateBookingStatus,
  cancelBookingByUser,
};
