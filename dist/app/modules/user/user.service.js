"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constant_1 = require("./user.constant");
// create a new user
const createUser = async (payload) => {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    // check if user already exists
    const isUserExit = await user_model_1.User.findOne({ email });
    if (isUserExit) {
        throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
};
// get all users
const getAllUsers = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = await queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        meta,
        data,
    };
};
// 
// const getAllSender = async (filters: Record<string, string>, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;
//   const senders = await User.find({ role: UserRole.AGENT, ...filters })
//     .select("-password")
//     .skip(skip)
//     .limit(limit);
//   const total = await User.countDocuments({ role: UserRole.AGENT, ...filters });
//   return {
//     data: senders,
//     meta: { total, page, limit }
//   };
// };
// //
// const getAllReceiver = async (filters: Record<string, string>, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;
//   const receivers = await User.find({ role: Role.RECEIVER, ...filters })
//     .select("-password")
//     .skip(skip)
//     .limit(limit);
//   const total = await User.countDocuments({ role: Role.RECEIVER, ...filters });
//   return {
//     data: receivers,
//     meta: { total, page, limit }
//   };
// };
// update user
const updateUser = async (userId, payload, decodedToken) => {
    const ifUserExist = await user_model_1.User.findById(userId);
    // Check if user exists
    if (!ifUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    // Check if the user is trying to update their own profile or an admin is updating another user
    if (ifUserExist.email !== decodedToken.email && decodedToken.role !== user_interface_1.UserRole.ADMIN) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to update this user");
    }
    // If role is being updated, check if the user is an admin and if the new role is valid
    if (payload.role) {
        if (decodedToken.role !== user_interface_1.UserRole.ADMIN) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can update user roles");
        }
        // Step 3: Check if role is valid
        if (!Object.values(user_interface_1.UserRole).includes(payload.role)) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid role provided");
        }
    }
    // If password is being updated, hash it
    if (payload.password) {
        payload.password = await bcryptjs_1.default.hash(payload.password, 10);
    }
    const newUpdatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
};
// get single user
const getSingleUser = async (id) => {
    const user = await user_model_1.User.findById(id).select("-password");
    return {
        data: user
    };
};
// get me
const getMe = async (userId) => {
    const user = await user_model_1.User.findById(userId).select("-password");
    return {
        data: user
    };
};
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser,
    getMe,
};
