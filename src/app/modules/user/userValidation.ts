import z from "zod";
import { UserRole, AccountStatus } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters."),

    email: z
        .string()
        .email("Invalid email format.")
        .min(5, "Email must be at least 5 characters.")
        .max(100, "Email cannot exceed 100 characters."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^(?=.*[A-Z])/, "Must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Must contain at least 1 number."),

    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number.")
        .optional(),

    profileImage: z.string().url("Profile image must be a valid URL.").optional(),

    address: z
        .string()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),

    role: z.enum(Object.values(UserRole) as [string]).optional(),

    status: z.enum(Object.values(AccountStatus) as [string]).optional(),
});


export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters.")
        .optional(),

    email: z
        .string()
        .email("Invalid email format.")
        .max(100, "Email cannot exceed 100 characters.")
        .optional(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^(?=.*[A-Z])/, "Must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Must contain at least 1 number.")
        .optional(),

    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number.")
        .optional(),

    profileImage: z
        .string()
        .url("Profile image must be a valid URL.")
        .optional(),

    address: z
        .string()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),

    role: z.enum(Object.values(UserRole) as [string]).optional(),

    status: z.enum(Object.values(AccountStatus) as [string]).optional(),

    isVerified: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
});

