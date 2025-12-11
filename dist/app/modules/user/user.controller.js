"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
//create 
const createUser = async (req, res, next) => {
    try {
        const user = await user_service_1.UserServices.createUser(req.body);
        res.status(http_status_codes_1.default.CREATED).json({
            message: "User Created Successfully",
            user
        });
    }
    catch (err) {
        console.log("🚀 ~ file: user.controller.ts ~ line 15 ~ createUser ~ error", next(err));
    }
};
// get all users
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await user_service_1.UserServices.getAllUsers(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Users fetched successfully",
        data: users.data,
        meta: users.meta
    });
});
// update user
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});
// get own profile
const getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.userId);
    console.log("🚀 ~ file: user.controller.ts ~ line 94 ~ getMe ~ result", result);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    });
});
// getSingleUser 
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const result = await user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    });
});
exports.UserControllers = {
    createUser,
    getAllUsers,
    getMe,
    getSingleUser,
    updateUser,
};
