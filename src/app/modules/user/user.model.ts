import { model, Schema } from "mongoose";
import { IAuthProvider, AccountStatus, IUser, UserRole } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    // basic info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    // user role
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    // optional
    phone: { type: String },
    profileImage: { type: String },
    address: { type: String },

    // account state
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },

    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    // oauth providers list
    auths: {
      type: [authProviderSchema],
      default: [],
    },

    // relations
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Tour" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
