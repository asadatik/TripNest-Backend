/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from "mongoose"
import { IPayment, PaymentStatus } from "./payment.interface"

const paymentSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    member: { type: Schema.Types.ObjectId, ref: "User" }, // ⭐ Add this
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    gateway: { type: String, default: "STRIPE" },
    gatewaySessionId: { type: String },
    gatewayPaymentIntentId: { type: String },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false }
)

// ⭐ Pre-find hook for automatic population
paymentSchema.pre(/^find/, function (next) {
  const query = this as any;
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
  })
  next()
})

export const Payment = model<IPayment>("Payment", paymentSchema)
