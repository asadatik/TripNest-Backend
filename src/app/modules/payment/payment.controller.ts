/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { PaymentService } from "./payment.service"
import { stripe } from "./stripe.config"
import AppError from "../../errorHelper/appError"
import { Payment } from "./payment.model"


export type AuthRequest = Request & {
  user?: {
    userId: string
    role: string
  }
}


//
const initStripeCheckout = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body
  if (!bookingId) throw new AppError(400, "bookingId is required")

  const successUrl =
    process.env.STRIPE_SUCCESS_URL ||
    `${process.env.BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl =
    process.env.STRIPE_CANCEL_URL ||
    `${process.env.BASE_URL}/payments/cancel`

  const result = await PaymentService.createCheckoutSession(
    bookingId,
    successUrl,
    cancelUrl,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stripe checkout session created",
    data: result,
  })
})


//
const confirmStripePayment = catchAsync(
  async (req: Request, res: Response) => {

    
     const authReq = req as AuthRequest


    const { sessionId } = req.body
    const userId = authReq.user!.userId

    console.log("Confirming payment for sessionId:", sessionId)
    console.log("User ID:", userId)


    if (!sessionId) {
      throw new AppError(400, "sessionId is required")
    }

    const result = await PaymentService.confirmCheckoutSession(
      sessionId,
      userId,
    )

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment confirmed",
      data: result,
    })
  },
)

// ✅ USER: Get my payments
const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId; // checkAuth middleware theke ashe

console.log( 'ttttttttttttttttttt',userId)


  const result = await PaymentService.getMyPaymentsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My payments retrieved successfully",
    data: result,
  });
});



// ✅ ADMIN: Get single payment by ID
const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  const result = await PaymentService.getSinglePaymentFromDB(paymentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});




/**
 *  Webhook handler in  future
 */
const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return res.status(500).send("Webhook secret not configured")
  }
  if (!sig) {
    return res.status(400).send("Missing Stripe-Signature header")
  }

  let event

  try {
    console.log("isBuffer:", Buffer.isBuffer(req.body))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      webhookSecret,
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // এখন PaymentService.handleStripeWebhook কমেন্টেড, future এ লাগলে uncomment করো
    // await PaymentService.handleStripeWebhook(event as any)
    return res.json({ received: true })
  } catch (err: any) {
    console.error("Webhook handling failed", err)
    return res.status(500).send("Internal error")
  }
}


// get all 
const getPayments = async (req: Request, res: Response) => {
  const payments = await Payment.find().sort({ createdAt: -1 })
  return res.json({
    success: true,
    data: payments,
  })
}




export const PaymentController = {
  initStripeCheckout,
  confirmStripePayment,
 getPayments,
  getMyPayments,
getSinglePayment,



  stripeWebhook 
 

}
