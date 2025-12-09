import { Types } from "mongoose";
import { PaymentStatus } from "../payment/payment.interface"; // ✅ একটাই enum ইউজ করব

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface IBooking {
  _id?: Types.ObjectId;
  member: Types.ObjectId;      // user who booked
  package: Types.ObjectId;     // package booked
  startDate?: Date;
  endDate?: Date;
  pax: number;                 // number of people
  totalAmount: number;
  currency?: string;
  status?: BookingStatus;
  paymentStatus: PaymentStatus; // এখন payment.interface থেকে আসা enum
  transactionId?: string;      // gateway transaction id
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
