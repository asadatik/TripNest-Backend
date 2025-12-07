/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

import { stripe } from "./stripe.config";
import AppError from "../../errorHelper/appError";

const initStripeCheckout = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  if (!bookingId) throw new AppError(400, "bookingId is required");

  const successUrl = process.env.STRIPE_SUCCESS_URL || `${process.env.BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = process.env.STRIPE_CANCEL_URL || `${process.env.BASE_URL}/payments/cancel`;

  const result = await PaymentService.createCheckoutSession(bookingId, successUrl, cancelUrl);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stripe checkout session created",
    data: result,
  });
});

// Raw body needed for signature verification — ensure express config allows raw body for webhook route
const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).send("Webhook secret not configured");
  }

  let event;
  try {
    // raw body must be used — make sure route uses express.raw()
    event = stripe.webhooks.constructEvent((req as any).rawBody, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await PaymentService.handleStripeWebhook(event);
    return res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handling failed", err);
    return res.status(500).send("Internal error");
  }
};

export const PaymentController = {
  initStripeCheckout,
  stripeWebhook,
};