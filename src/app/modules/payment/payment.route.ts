import express from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { initPaymentZodSchema } from "./payment.validation";

const router = express.Router();

/**
 * NOTE:
 * - /create -> called by frontend to create Stripe Checkout session (user must be logged in and booking owned by user)
 * - /webhook -> public endpoint used by Stripe to post events. Must NOT use body-parser JSON middleware for this route; use raw.
 */

router.post("/create", checkAuth(UserRole.USER), validateRequest(initPaymentZodSchema), PaymentController.initStripeCheckout);

// webhook: do not use checkAuth
router.post("/webhook", express.raw({ type: "application/json" }), PaymentController.stripeWebhook);

export const PaymentRoutes = router;
