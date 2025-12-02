import { Types } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT",
}

export interface IAuthProvider {
    provider: string;      // e.g., "google", "github", "credentials"
    providerId: string;    // unique id from OAuth provider
}

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED",
}

export interface IUser {
    _id?: Types.ObjectId;

    // Basic Info
    name: string;
    email: string;
    password?: string;

    // Optional Info
    phone?: string;
    profileImage?: string;
    address?: string;

    // Account Control
    status?: AccountStatus;
    isVerified?: boolean;
    isDeleted?: boolean;

    // Auth Info
    role: UserRole;
    auths?: IAuthProvider[];

    // Relations
    bookings?: Types.ObjectId[];   // User’s all bookings
    reviews?: Types.ObjectId[];    // User given reviews
    wishlist?: Types.ObjectId[];   // Saved tours
}
