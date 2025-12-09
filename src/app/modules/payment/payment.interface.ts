/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  _id?: Types.ObjectId;
  booking: Types.ObjectId;
  member?: Types.ObjectId;
  amount: number;
  currency?: string;
  gateway?: string; // "STRIPE"
  gatewaySessionId?: string; // Stripe Checkout Session id
  gatewayPaymentIntentId?: string; // Stripe PaymentIntent id
  status: PaymentStatus;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
