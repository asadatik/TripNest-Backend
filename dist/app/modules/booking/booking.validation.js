"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsQuerySchema = exports.updateBookingStatusZodSchema = exports.createBookingZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBookingZodSchema = zod_1.default.object({
    package: zod_1.default.string().min(1, "Package id is required"),
    startDate: zod_1.default.string().optional(),
    endDate: zod_1.default.string().optional(),
    pax: zod_1.default.number().int().positive("Pax must be a positive integer"),
    totalAmount: zod_1.default.number().nonnegative("Total amount must be non-negative").optional(),
    currency: zod_1.default.string().optional(),
    notes: zod_1.default.string().max(500).optional(),
    member: zod_1.default.string().optional() // <- optional for validation
});
exports.updateBookingStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
    paymentStatus: zod_1.default
        .enum(["UNPAID", "PAID", "REFUNDED", "FAILED"])
        .optional(),
    transactionId: zod_1.default.string().optional(),
    notes: zod_1.default.string().max(500).optional(),
});
exports.getAllBookingsQuerySchema = zod_1.default.object({
    pax: zod_1.default
        .string()
        .optional()
        .refine(val => !val || !isNaN(Number(val)), {
        message: "pax must be a valid number",
    }),
    status: zod_1.default
        .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
        .optional(),
    package: zod_1.default.string().optional(),
    searchTerm: zod_1.default.string().optional(),
    limit: zod_1.default.string().optional(),
    page: zod_1.default.string().optional(),
    sortBy: zod_1.default.string().optional(),
    sortOrder: zod_1.default.enum(["asc", "desc"]).optional(),
});
