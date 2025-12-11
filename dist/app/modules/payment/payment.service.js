"use strict";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_config_1 = require("./stripe.config");
const payment_model_1 = require("./payment.model");
const booking_model_1 = require("../booking/booking.model");
const package_model_1 = require("../package/package.model");
const payment_interface_1 = require("./payment.interface");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const booking_interface_1 = require("../booking/booking.interface");
const mongoose_1 = require("mongoose");
//create checkout session 
const createCheckoutSession = async (bookingId, successUrl, cancelUrl) => {
    console.log("Creating checkout session for bookingId:", bookingId);
    const booking = await booking_model_1.Booking.findById(bookingId).populate("package");
    if (!booking)
        throw new appError_1.default(404, "Booking not found");
    console.log("Booking found:", booking);
    if ((booking === null || booking === void 0 ? void 0 : booking.paymentStatus) === payment_interface_1.PaymentStatus.PAID) {
        throw new appError_1.default(400, "Booking already paid");
    }
    const pkg = booking.package;
    const amount = Math.round((booking.totalAmount || 0) * 100);
    const currency = (booking.currency || "BDT").toLowerCase();
    const paymentRecord = await payment_model_1.Payment.create({
        booking: booking._id,
        member: booking.member,
        amount: booking.totalAmount,
        currency: booking.currency || "BDT",
        gateway: "STRIPE",
        status: payment_interface_1.PaymentStatus.UNPAID,
    });
    const session = await stripe_config_1.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: `TripNest Booking: ${pkg.title || "Package"}`,
                        description: pkg.summary || pkg.description || "",
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            bookingId: booking._id.toString(),
            paymentId: paymentRecord._id.toString(),
        },
    });
    paymentRecord.gatewaySessionId = session.id;
    await paymentRecord.save();
    return {
        sessionId: session.id,
        url: session.url,
    };
};
//
const confirmCheckoutSession = async (sessionId, userId) => {
    // 1) Stripe থেকে session ফেচ করো
    const session = await stripe_config_1.stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
        throw new appError_1.default(404, "Stripe session not found");
    }
    if (session.payment_status !== "paid") {
        throw new appError_1.default(400, "Payment not completed");
    }
    const metadata = session.metadata || {};
    const bookingId = metadata.bookingId;
    const paymentId = metadata.paymentId;
    const paymentIntentId = session.payment_intent;
    if (!bookingId || !paymentId) {
        throw new appError_1.default(400, "Missing bookingId or paymentId in Stripe metadata");
    }
    // 2) Payment আপডেট
    const payment = await payment_model_1.Payment.findById(paymentId);
    if (!payment) {
        throw new appError_1.default(404, "Payment record not found");
    }
    payment.status = payment_interface_1.PaymentStatus.PAID;
    payment.gatewaySessionId = session.id;
    if (paymentIntentId) {
        payment.gatewayPaymentIntentId = paymentIntentId;
    }
    await payment.save();
    // 3) Booking আপডেট
    const booking = await booking_model_1.Booking.findOne({ _id: bookingId, member: userId }).populate("package");
    if (!booking) {
        throw new appError_1.default(404, "Booking not found for this user");
    }
    booking.paymentStatus = payment_interface_1.PaymentStatus.PAID;
    booking.status = booking_interface_1.BookingStatus.CONFIRMED;
    if (paymentIntentId) {
        booking.transactionId = paymentIntentId;
    }
    await booking.save();
    // 4) seat adjust (এটা চাইলে createBooking এও করতে পারো, কিন্তু এখানে safe)
    const pkg = await package_model_1.Package.findById(booking.package);
    if (pkg && typeof pkg.availableSeats === "number") {
        pkg.availableSeats =
            (pkg.availableSeats || 0) - (booking.pax || 1);
        if (pkg.availableSeats < 0)
            pkg.availableSeats = 0;
        await pkg.save();
    }
    return { booking, payment, session };
};
// ADMIN: Get single payment
const getSinglePaymentFromDB = async (paymentId) => {
    if (!mongoose_1.Types.ObjectId.isValid(paymentId)) {
        throw new appError_1.default(400, "Invalid payment ID");
    }
    const payment = await payment_model_1.Payment.findById(paymentId)
        .populate("member", "name email phone role")
        .populate({
        path: "booking",
        select: "pax status paymentStatus totalAmount",
        populate: {
            path: "package",
            select: "title slug destination costFrom",
        },
    });
    if (!payment) {
        throw new appError_1.default(404, "Payment not found");
    }
    return payment;
};
// USER: Get my payments
const getMyPaymentsFromDB = async (userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new appError_1.default(400, "Invalid user ID");
    }
    const payments = await payment_model_1.Payment.find({ member: userId }) // 
        .populate({
        path: "booking",
        select: "pax status paymentStatus totalAmount",
        populate: {
            path: "package",
            select: "title slug destination costFrom durationDays",
        },
    })
        .sort({ createdAt: -1 });
    return payments;
};
//
// const handleStripeWebhook = async (event: Stripe.Event) => {
//   const type = event.type
//
//   if (type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session
//     const bookingId = session.metadata?.bookingId
//     const paymentId = session.metadata?.paymentId
//     const paymentIntentId = session.payment_intent as string | null
//
//     const payment = await Payment.findById(paymentId)
//     if (payment) {
//       payment.status = PaymentStatus.PAID
//       if (paymentIntentId) {
//         payment.gatewayPaymentIntentId = paymentIntentId
//       }
//       await payment.save()
//     }
//
//     const booking = await Booking.findById(bookingId).populate("package")
//     if (!booking) throw new AppError(404, "Booking not found")
//
//     booking.paymentStatus = PaymentStatus.PAID
//     booking.status = BookingStatus.CONFIRMED
//     if (paymentIntentId) {
//       booking.transactionId = paymentIntentId
//     }
//     await booking.save()
//
//     const pkg = await Package.findById(booking.package)
//     if (pkg && typeof pkg.availableSeats === "number") {
//       pkg.availableSeats =
//         (pkg.availableSeats || 0) - (booking.pax || 1)
//       if (pkg.availableSeats < 0) pkg.availableSeats = 0
//       await pkg.save()
//     }
//   }
//
//   if (type === "payment_intent.payment_failed") {
//     const pi = event.data.object as Stripe.PaymentIntent
//     const metadata = pi.metadata || {}
//     const paymentId = metadata.paymentId
//     const payment = await Payment.findById(paymentId)
//
//     if (payment) {
//       payment.status = PaymentStatus.FAILED
//       await payment.save()
//     }
//
//     const bookingId = metadata.bookingId
//     if (bookingId) {
//       const booking = await Booking.findById(bookingId)
//       if (booking) {
//         booking.paymentStatus = PaymentStatus.FAILED
//         await booking.save()
//       }
//     }
//   }
//
//   return true
// }
exports.PaymentService = {
    createCheckoutSession,
    confirmCheckoutSession,
    getSinglePaymentFromDB,
    getMyPaymentsFromDB
    // handleStripeWebhook, 
};
