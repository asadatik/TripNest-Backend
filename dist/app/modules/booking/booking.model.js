"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("./booking.interface");
const payment_interface_1 = require("../payment/payment.interface");
const bookingSchema = new mongoose_1.Schema({
    member: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", },
    package: { type: mongoose_1.Schema.Types.ObjectId, ref: "Package", required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    pax: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "BDT" },
    status: {
        type: String,
        enum: Object.values(booking_interface_1.BookingStatus),
        default: booking_interface_1.BookingStatus.PENDING,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.UNPAID,
    },
    transactionId: { type: String }, // gateway tx id if any
    notes: { type: String },
}, { timestamps: true, versionKey: false });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
