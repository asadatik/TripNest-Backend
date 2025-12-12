"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
const booking_model_1 = require("./booking.model");
const booking_interface_1 = require("./booking.interface");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const package_model_1 = require("../package/package.model");
const booking_constant_1 = require("./booking.constant");
const payment_interface_1 = require("../payment/payment.interface");
//createBooking: সিট খালি আছে কিনা চেক করা, নতুন বুকিং তৈরি করা এবং availableSeats কমিয়ে ফেলা 
const createBooking = async (payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Load package and check availability
        const pkg = await package_model_1.Package.findById(payload.package).session(session);
        if (!pkg)
            throw new Error("Package not found.");
        // ⭐ totalAmount + currency এখানে set করো
        const pax = payload.pax || 1;
        const costFrom = pkg.costFrom || 0;
        if (payload.totalAmount == null) {
            payload.totalAmount = costFrom * pax;
        }
        if (!payload.currency) {
            payload.currency = pkg.currency || "BDT";
        }
        // If capacity defined, check
        if (pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
            if (pkg.availableSeats < pax) {
                throw new Error("Not enough available seats for this package.");
            }
            // decrement available seats
            pkg.availableSeats = (pkg.availableSeats || 0) - pax;
            await pkg.save({ session });
        }
        // Create booking
        const booking = await booking_model_1.Booking.create([payload], { session });
        await session.commitTransaction();
        session.endSession();
        return booking[0];
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};
//getAllBookings: অ্যাডমিনের জন্য সব বুকিংয়ের লিস্ট বের করা
const getAllBookings = async (query) => {
    const qb = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find()
        .populate("member", "name email")
        .populate("package", "title slug"), query);
    const bookingsQuery = qb
        .search(booking_constant_1.bookingSearchableFields)
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
//getSingleBooking: id দিয়ে নির্দিষ্ট একটি বুকিং খুঁজে বের করা
const getSingleBooking = async (id) => {
    const booking = await booking_model_1.Booking.findById(id).populate("member", "name email phone").populate("package", "title slug costFrom");
    if (!booking)
        throw new Error("Booking not found.");
    return booking;
};
//  getMemberBookings: একজন নির্দিষ্ট ইউজারের বুকিংগুলো বের করা
const getMemberBookings = async (memberId, query) => {
    const qb = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find({ member: memberId }).populate("package", "title slug costFrom"), query);
    const bookingsQuery = qb.search(booking_constant_1.bookingSearchableFields).filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([bookingsQuery.build(), qb.getMeta()]);
    return { data, meta };
};
// updateBookingStatus: অ্যাডমিন দ্বারা স্ট্যাটাস পরিবর্তন করা (এবং সেই অনুযায়ী সিট সংখ্যা বাড়ানো বা কমানো হ্যান্ডেল করা)
const updateBookingStatus = async (id, payload) => {
    // If changing status to CANCELLED and booking was PAID -> set to REFUNDED (payment handling external)
    const booking = await booking_model_1.Booking.findById(id);
    if (!booking)
        throw new Error("Booking not found.");
    const prevStatus = booking.status;
    // const prevPaymentStatus = booking.paymentStatus;
    // Handle seat adjust when cancelling or confirming
    if (payload.status === booking_interface_1.BookingStatus.CANCELLED && prevStatus !== booking_interface_1.BookingStatus.CANCELLED) {
        // increment seats back
        const pkg = await package_model_1.Package.findById(booking.package);
        if (pkg && pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
            pkg.availableSeats = (pkg.availableSeats || 0) + (booking.pax || 1);
            await pkg.save();
        }
        // mark payment status -> REFUNDED if previously PAID (actual refund call is external)
        if (booking.paymentStatus === payment_interface_1.PaymentStatus.PAID) {
            booking.paymentStatus = payment_interface_1.PaymentStatus.REFUNDED;
        }
    }
    if (payload.status === booking_interface_1.BookingStatus.CONFIRMED && prevStatus !== booking_interface_1.BookingStatus.CONFIRMED) {
        // nothing to do for seats if already decremented at booking creation
    }
    // apply updates
    booking.status = payload.status || booking.status;
    if (payload.paymentStatus)
        booking.paymentStatus = payload.paymentStatus;
    if (payload.transactionId)
        booking.transactionId = payload.transactionId;
    if (payload.notes)
        booking.notes = payload.notes;
    await booking.save();
    return booking;
};
const getMemberBookingById = async (userId, bookingId) => {
    if (!mongoose_1.Types.ObjectId.isValid(bookingId)) {
        return null;
    }
    const booking = await booking_model_1.Booking.findOne({
        _id: bookingId,
        user: userId,
    })
        .populate("package")
        .lean();
    return booking;
};
// cancelBookingByUser: ইউজার নিজেই যদি বুকিং বাতিল করে, তাহলে সেই হ্যান্ডেল করা 
const cancelBookingByUser = async (id, memberId) => {
    const booking = await booking_model_1.Booking.findById(id);
    console.log("Cancelling booking ID:", id, "for member ID:", memberId);
    console.log("Booking found:", booking);
    if (!booking)
        throw new Error("Booking not found.");
    if (booking.member.toString() !== memberId)
        throw new Error("Unauthorized to cancel this booking.");
    if (booking.status === booking_interface_1.BookingStatus.CANCELLED)
        throw new Error("Booking already cancelled.");
    // increment seats
    const pkg = await package_model_1.Package.findById(booking.package);
    if (pkg && pkg.availableSeats !== undefined && pkg.availableSeats !== null) {
        pkg.availableSeats = (pkg.availableSeats || 0) + (booking.pax || 1);
        await pkg.save();
    }
    booking.status = booking_interface_1.BookingStatus.CANCELLED;
    // if paid then mark refund state; actual refund call to payment gateway should be done elsewhere (e.g., PaymentService)
    if (booking.paymentStatus === payment_interface_1.PaymentStatus.PAID)
        booking.paymentStatus = payment_interface_1.PaymentStatus.REFUNDED;
    await booking.save();
    return booking;
};
exports.BookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getMemberBookings,
    updateBookingStatus,
    getMemberBookingById,
    cancelBookingByUser,
};
