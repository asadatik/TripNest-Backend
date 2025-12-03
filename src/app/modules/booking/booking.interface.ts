import { Types } from "mongoose";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
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
  paymentStatus?: PaymentStatus;
  transactionId?: string;      // gateway transaction id
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
