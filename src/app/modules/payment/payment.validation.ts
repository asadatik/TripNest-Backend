import z from "zod";

export const initPaymentZodSchema = z.object({
  bookingId: z.string().min(1, "Booking id is required"),
  // optional: override amount (if you allow client-provided amount - be careful)
  // amount: z.number().nonnegative().optional(),
});

export const stripeWebhookZodSchema = z.object({
  rawBody: z.string(),
  signature: z.string(),
});
