/* eslint-disable no-console */
// payment.route.ts
import express from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { initPaymentZodSchema } from "./payment.validation";

const router = express.Router();

router.get("/", PaymentController.getPayments);

router.post(
  "/create",
  checkAuth(UserRole.USER),
  validateRequest(initPaymentZodSchema),
  PaymentController.initStripeCheckout
);

router.post(
  "/confirm",
  checkAuth(UserRole.USER),
  PaymentController.confirmStripePayment,
)



// // 🔴 Webhook: raw body, no auth, no json parser here
// router.post(
//   "/webhook",
//   (req, res, next) => {
//     console.log("HIT /payment/webhook route, raw middleware incoming");
//     next();
//   },
//   express.raw({ type: "application/json" }),
//   PaymentController.stripeWebhook
// );


export const PaymentRoutes = router;
