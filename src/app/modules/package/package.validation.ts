import z from "zod";

export const createPackageZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  summary: z.string().max(250).optional(),
  description: z.string().optional(),
  destination: z.string().optional(),
  costFrom: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  durationDays: z.number().int().positive().optional(),
  capacity: z.number().int().nonnegative().optional(),
  startDate: z.string().optional(), // ISO date string expected
  endDate: z.string().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  itinerary: z.array(z.string()).optional(),
  minAge: z.number().int().optional(),
  maxAge: z.number().int().optional(),
  packageType: z.string().optional(), // ObjectId as string
  division: z.string().optional(),    // ObjectId as string
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  deleteImages: z.array(z.string()).optional(), // for update
});

export const updatePackageZodSchema = createPackageZodSchema.partial();
