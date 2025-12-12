/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from "mongoose";
import { Booking } from "./booking.model";

import { IBooking, BookingStatus,  } from "./booking.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Package } from "../package/package.model";
import { bookingSearchableFields } from "./booking.constant";
import { PaymentStatus } from "../payment/payment.interface";


//createBooking: 

const createBooking = async (payload: IBooking) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Load package and check availability
    const pkg = await Package.findById(payload.package).session(session)
    if (!pkg) throw new Error("Package not found.")

    // ⭐ totalAmount + currency এখানে set করো
    const pax = payload.pax || 1
    const costFrom = (pkg as any).costFrom || 0

    if (payload.totalAmount == null) {
      payload.totalAmount = costFrom * pax
    }
    if (!payload.currency) {
      payload.currency = (pkg as any).currency || "BDT"
    }

    // If capacity defined, check
    if (pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
      if (pkg.availableSeats < pax) {
        throw new Error("Not enough available seats for this package.")
      }
      // decrement available seats
      pkg.availableSeats = (pkg.availableSeats || 0) - pax
      await pkg.save({ session })
    }

    // Create booking
    const booking = await Booking.create([payload], { session })
    await session.commitTransaction()
    session.endSession()

    return booking[0]
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}




//getAllBookings: 

const getAllBookings = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(
    Booking.find()
      .populate("member", "name email")
      .populate("package", "title slug"),
    query
  );

  const bookingsQuery = qb
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    bookingsQuery.build(),
    qb.getMeta(),
  ]);

  return { data, meta };
};




//getSingleBooking: 
const getSingleBooking = async (id: string) => {
  const booking = await Booking.findById(id).populate("member", "name email phone").populate("package", "title slug costFrom");
  if (!booking) throw new Error("Booking not found.");
  return booking;
};
//  getMemberBookings: 
const getMemberBookings = async (memberId: string, query: Record<string, string>) => {
  const qb = new QueryBuilder(Booking.find({ member: memberId }).populate("package", "title slug costFrom"), query);
  const bookingsQuery = qb.search(bookingSearchableFields).filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([bookingsQuery.build(), qb.getMeta()]);
  return { data, meta };
};

// updateBookingStatus: 
const updateBookingStatus = async (id: string, payload: Partial<IBooking>) => {
  // If changing status to CANCELLED and booking was PAID -> set to REFUNDED (payment handling external)
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found.");

  const prevStatus = booking.status;
  // const prevPaymentStatus = booking.paymentStatus;

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

const getMemberBookingById = async (userId: string, bookingId: string) => {
  if (!Types.ObjectId.isValid(bookingId)) {
    return null
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  })
    .populate("package")
    .lean()

  return booking
}

// cancelBookingByUser: 
const cancelBookingByUser = async (id: string, memberId: string) => {
  const booking = await Booking.findById(id);

  console.log("Cancelling booking ID:", id, "for member ID:", memberId);
  console.log("Booking found:", booking);
  
  if (!booking) throw new Error("Booking not found.");
  if (booking.member.toString() !== memberId) throw new Error("Unauthorized to cancel this booking.");
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
  getMemberBookingById ,
  cancelBookingByUser,
};
