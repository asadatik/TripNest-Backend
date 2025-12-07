// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from "express";
// import { PaymentService } from "./payment.service";


// import { catchAsync } from "../../utils/catchAsync";
// import { stripe } from "../payment/stripe.config";
// import { sendResponse } from "../../utils/sendResponse";

// const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {

//     const sig = req.headers["stripe-signature"] as string;
//     const webhookSecret = "whsec_7aa0e876564d7172ed1ebbda82f18cd6c740ac93ff44efecbf654c0d71bf3f1c"

//     let event;
//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
//     } catch (err: any) {
//         console.error("⚠️ Webhook signature verification failed:", err.message);
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//     }
//     const result = await PaymentService.handleStripeWebhookEvent(event);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'Webhook req send successfully',
//         data: result,
//     });
// });

// export const PaymentController = {
//     handleStripeWebhookEvent
// }