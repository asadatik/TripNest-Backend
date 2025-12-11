"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookZodSchema = exports.initPaymentZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.initPaymentZodSchema = zod_1.default.object({
    bookingId: zod_1.default.string().min(1, "Booking id is required"),
    // optional: override amount (if you allow client-provided amount - be careful)
    // amount: z.number().nonnegative().optional(),
});
exports.stripeWebhookZodSchema = zod_1.default.object({
    rawBody: zod_1.default.string(),
    signature: zod_1.default.string(),
});
