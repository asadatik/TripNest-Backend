"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageZodSchema = exports.createPackageZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createPackageZodSchema = zod_1.default.object({
    title: zod_1.default.string().min(3, "Title must be at least 3 characters."),
    summary: zod_1.default.string().max(250).optional(),
    description: zod_1.default.string().optional(),
    destination: zod_1.default.string().optional(),
    costFrom: zod_1.default.number().nonnegative().optional(),
    currency: zod_1.default.string().optional(),
    durationDays: zod_1.default.number().int().positive().optional(),
    capacity: zod_1.default.number().int().nonnegative().optional(),
    startDate: zod_1.default.string().optional(), // ISO date string expected
    endDate: zod_1.default.string().optional(),
    departureLocation: zod_1.default.string().optional(),
    arrivalLocation: zod_1.default.string().optional(),
    included: zod_1.default.array(zod_1.default.string()).optional(),
    excluded: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    itinerary: zod_1.default.array(zod_1.default.string()).optional(),
    minAge: zod_1.default.number().int().optional(),
    maxAge: zod_1.default.number().int().optional(),
    packageType: zod_1.default.string().optional(), // ObjectId as string
    division: zod_1.default.string().optional(), // ObjectId as string
    tags: zod_1.default.array(zod_1.default.string()).optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional(), // for update
});
exports.updatePackageZodSchema = exports.createPackageZodSchema.partial();
