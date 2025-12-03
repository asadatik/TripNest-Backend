import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    gateway: { type: String, default: "STRIPE" },
    gatewaySessionId: { type: String },
    gatewayPaymentIntentId: { type: String },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
