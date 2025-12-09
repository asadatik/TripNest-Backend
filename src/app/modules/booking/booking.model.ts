import { model, Schema } from "mongoose";
import { IBooking, BookingStatus,  } from "./booking.interface";
import { PaymentStatus } from "../payment/payment.interface";


const bookingSchema = new Schema<IBooking>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", },
    package: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    pax: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    transactionId: { type: String }, // gateway tx id if any
    notes: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
