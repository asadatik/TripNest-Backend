"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    // basic info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    // user role
    role: {
        type: String,
        enum: Object.values(user_interface_1.UserRole),
        default: user_interface_1.UserRole.USER,
    },
    // optional
    phone: { type: String },
    profileImage: { type: String },
    address: { type: String },
    // account state
    status: {
        type: String,
        enum: Object.values(user_interface_1.AccountStatus),
        default: user_interface_1.AccountStatus.ACTIVE,
    },
    isVerified: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    // oauth providers list
    auths: {
        type: [authProviderSchema],
        default: [],
    },
    // relations
    bookings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Booking" }],
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Review" }],
    wishlist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Tour" }],
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
