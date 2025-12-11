"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    booking: { type: mongoose_1.Schema.Types.ObjectId, ref: "Booking", required: true },
    member: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" }, // ⭐ Add this
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    gateway: { type: String, default: "STRIPE" },
    gatewaySessionId: { type: String },
    gatewayPaymentIntentId: { type: String },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.UNPAID,
    },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true, versionKey: false });
// ⭐ Pre-find hook for automatic population
paymentSchema.pre(/^find/, function (next) {
    const query = this;
    query.populate({
        path: "member",
        select: "name email phone",
    }).populate({
        path: "booking",
        select: "pax status paymentStatus totalAmount",
        populate: {
            path: "package",
            select: "title destination costFrom currency durationDays",
        },
    });
    next();
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
