import z from "zod";

export const createBookingZodSchema = z.object({
  package: z.string().min(1, "Package id is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pax: z.number().int().positive("Pax must be a positive integer"),
  totalAmount: z.number().nonnegative("Total amount must be non-negative"),
  currency: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updateBookingStatusZodSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  paymentStatus: z
    .enum(["UNPAID", "PAID", "REFUNDED", "FAILED"])
    .optional(),
  transactionId: z.string().optional(),
  notes: z.string().max(500).optional(),
});
