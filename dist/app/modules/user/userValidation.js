"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters."),
    email: zod_1.default
        .string()
        .email("Invalid email format.")
        .min(5, "Email must be at least 5 characters.")
        .max(100, "Email cannot exceed 100 characters."),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^(?=.*[A-Z])/, "Must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Must contain at least 1 number."),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number.")
        .optional(),
    profileImage: zod_1.default.string().url("Profile image must be a valid URL.").optional(),
    address: zod_1.default
        .string()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.UserRole)).optional(),
    status: zod_1.default.enum(Object.values(user_interface_1.AccountStatus)).optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters.")
        .optional(),
    email: zod_1.default
        .string()
        .email("Invalid email format.")
        .max(100, "Email cannot exceed 100 characters.")
        .optional(),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^(?=.*[A-Z])/, "Must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Must contain at least 1 number.")
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number.")
        .optional(),
    profileImage: zod_1.default
        .string()
        .url("Profile image must be a valid URL.")
        .optional(),
    address: zod_1.default
        .string()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.UserRole)).optional(),
    status: zod_1.default.enum(Object.values(user_interface_1.AccountStatus)).optional(),
    isVerified: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default.boolean().optional(),
});
