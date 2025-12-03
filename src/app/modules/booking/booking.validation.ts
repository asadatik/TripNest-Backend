import z from "zod";

export const createBookingZodSchema = z.object({
  package: z.string().min(1, "Package id is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pax: z.number().int().positive("Pax must be a positive integer"),
  totalAmount: z.number().nonnegative("Total amount must be non-negative"),
  currency: z.string().optional(),
  notes: z.string().max(500).optional(),
    member: z.string().optional() // <- optional for validation

});

export const updateBookingStatusZodSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  paymentStatus: z
    .enum(["UNPAID", "PAID", "REFUNDED", "FAILED"])
    .optional(),
  transactionId: z.string().optional(),
  notes: z.string().max(500).optional(),
  

});




export const getAllBookingsQuerySchema = z.object({
  pax: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(Number(val)), {
      message: "pax must be a valid number",
    }),

  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
    .optional(),

  package: z.string().optional(),
  searchTerm: z.string().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
