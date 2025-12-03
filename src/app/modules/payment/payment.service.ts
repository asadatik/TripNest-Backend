/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { stripe } from "./stripe.config";
import { Payment } from "./payment.model";

import { Booking } from "../booking/booking.model";
import { Package } from "../package/package.model";

import { IPayment, PaymentStatus } from "./payment.interface";
import mongoose from "mongoose";
import AppError from "../../errorHelper/appError";


const CURRENCY = "bdt"; // Stripe expects lowercase 'bdt' etc. but Stripe may not support BDT for all flows; often use 'usd' for stripe tests.

const createCheckoutSession = async (bookingId: string, successUrl: string, cancelUrl: string) => {

    console.log("Creating checkout session for bookingId:", bookingId);
  // load booking and package
  const booking = await Booking.findById(bookingId).populate("package");
  if (!booking) throw new AppError(404, "Booking not found");

  console.log("Booking found:", booking);

  // Prevent duplicate session if payment already PAID
  if (booking?.paymentStatus === "PAID") {
    throw new AppError(400, "Booking already paid");
  }

  const pkg: any = booking.package;
  const amount = Math.round((booking.totalAmount || 0) * 100); // cents (or smallest currency unit)
  const currency = (booking.currency || "BDT").toLowerCase();

  // create a Payment record (pending) to track
  const paymentRecord = await Payment.create({
    booking: booking._id,
    amount: booking.totalAmount,
    currency: booking.currency || "BDT",
    gateway: "STRIPE",
    status: PaymentStatus.PENDING,
  });

  // Stripe: create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: `TripNest Booking: ${pkg.title || "Package"}`,
            description: pkg.summary || pkg.description || "",
          },
          unit_amount: amount, // in smallest currency unit
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

  // Save session id to Payment record
  paymentRecord.gatewaySessionId = session.id;
  await paymentRecord.save();

  return {
    sessionId: session.id,
    url: session.url,
  };
};



const handleStripeWebhook = async (event: any) => {
  // handle checkout.session.completed and payment_intent.succeeded events
  const type = event.type;

  if (type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    const paymentId = session.metadata?.paymentId;
    const paymentIntentId = session.payment_intent;

    // mark payment record success
    const payment = await Payment.findById(paymentId);
    if (payment) {
      payment.status = PaymentStatus.PAID;
      payment.gatewayPaymentIntentId = paymentIntentId;
      await payment.save();
    }

    // update booking
    const booking = await Booking.findById(bookingId);


  if (!booking) throw new AppError(404, "Booking not found");


  console.log("Booking found:", booking);

    if (booking) {
      booking.paymentStatus = "PAID";
      booking.status = "CONFIRMED";
      booking.transactionId = paymentIntentId;
      await booking.save();

      // decrement package seats inside a session (best effort)
      const pkg = await Package.findById(booking.package);
      if (pkg && typeof pkg.availableSeats === "number") {
        pkg.availableSeats = (pkg.availableSeats || 0) - (booking.pax || 1);
        if (pkg.availableSeats < 0) pkg.availableSeats = 0;
        await pkg.save();
      }
    }
  }

  if (type === "payment_intent.payment_failed") {
    const pi = event.data.object;
    const metadata = pi.metadata || {};
    const paymentId = metadata.paymentId;
    const payment = await Payment.findById(paymentId);
    if (payment) {
      payment.status = PaymentStatus.FAILED;
      await payment.save();
    }

    // optionally update booking paymentStatus = FAILED
    const bookingId = metadata.bookingId;
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = "FAILED";
        await booking.save();
      }
    }
  }

  // Other events can be handled as needed
  return true;
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhook,
};
