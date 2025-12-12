"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const payment_service_1 = require("./payment.service");
// import { stripe } from "./stripe.config"
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const payment_model_1 = require("./payment.model");
//
const initStripeCheckout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { bookingId } = req.body;
    if (!bookingId)
        throw new appError_1.default(400, "bookingId is required");
    const successUrl = process.env.STRIPE_SUCCESS_URL ||
        `${process.env.BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = process.env.STRIPE_CANCEL_URL ||
        `${process.env.BASE_URL}/payments/cancel`;
    const result = await payment_service_1.PaymentService.createCheckoutSession(bookingId, successUrl, cancelUrl);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Stripe checkout session created",
        data: result,
    });
});
//
const confirmStripePayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const authReq = req;
    const { sessionId } = req.body;
    const userId = authReq.user.userId;
    console.log("Confirming payment for sessionId:", sessionId);
    console.log("User ID:", userId);
    if (!sessionId) {
        throw new appError_1.default(400, "sessionId is required");
    }
    const result = await payment_service_1.PaymentService.confirmCheckoutSession(sessionId, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment confirmed",
        data: result,
    });
});
// ✅ USER: Get my payments
const getMyPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId; // checkAuth middleware theke ashe
    console.log('ttttttttttttttttttt', userId);
    const result = await payment_service_1.PaymentService.getMyPaymentsFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "My payments retrieved successfully",
        data: result,
    });
});
// ✅ ADMIN: Get single payment by ID
const getSinglePayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { paymentId } = req.params;
    const result = await payment_service_1.PaymentService.getSinglePaymentFromDB(paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
});
/**
 *  Webhook handler in  future
 */
// const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string | undefined
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
//   if (!webhookSecret) {
//     return res.status(500).send("Webhook secret not configured")
//   }
//   if (!sig) {
//     return res.status(400).send("Missing Stripe-Signature header")
//   }
//   let event
//   try {
//     console.log("isBuffer:", Buffer.isBuffer(req.body))
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     event = stripe.webhooks.constructEvent(
//       req.body as Buffer,
//       sig,
//       webhookSecret,
//     )
//   } catch (err: any) {
//     console.error("Webhook signature verification failed.", err.message)
//     return res.status(400).send(`Webhook Error: ${err.message}`)
//   }
//   try {
//     // এখন PaymentService.handleStripeWebhook কমেন্টেড, future এ লাগলে uncomment করো
//     // await PaymentService.handleStripeWebhook(event as any)
//     return res.json({ received: true })
//   } catch (err: any) {
//     console.error("Webhook handling failed", err)
//     return res.status(500).send("Internal error")
//   }
// }
// get all 
const getPayments = async (req, res) => {
    const payments = await payment_model_1.Payment.find().sort({ createdAt: -1 });
    return res.json({
        success: true,
        data: payments,
    });
};
exports.PaymentController = {
    initStripeCheckout,
    confirmStripePayment,
    getPayments,
    getMyPayments,
    getSinglePayment,
    // stripeWebhook 
};
