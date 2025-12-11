"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
/* eslint-disable no-console */
// payment.route.ts
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
//get all
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), payment_controller_1.PaymentController.getPayments);
//get my payments
router.get("/my-payments", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.USER), payment_controller_1.PaymentController.getMyPayments);
//create payment intent
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.USER), (0, validateRequest_1.validateRequest)(payment_validation_1.initPaymentZodSchema), payment_controller_1.PaymentController.initStripeCheckout);
//confirm payment
router.post("/confirm", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.USER), payment_controller_1.PaymentController.confirmStripePayment);
//get single payment
router.get("/admin/:paymentId", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), payment_controller_1.PaymentController.getSinglePayment);
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
exports.PaymentRoutes = router;
