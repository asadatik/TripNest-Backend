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
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const setCookie_1 = require("../../utils/setCookie");
const userTokens_1 = require("../../utils/userTokens");
// credentialsLogin
const credentialsLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const loginInfo = await auth_service_1.AuthServices.credentialsLogin(req.body);
    if (!loginInfo) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const userToken = (0, userTokens_1.createUserTokens)(loginInfo);
    (0, setCookie_1.setAuthCookie)(res, userToken);
    // Remove password from the user object before returning
    const _a = loginInfo.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged In Successfully",
        data: {
            accessToken: userToken.accessToken,
            refreshToken: userToken.refreshToken,
            user: rest,
        },
    });
});
//  gwtNewAccestoken      
const getNewAccestoken = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    var _a;
    const refreshToken = req.cookies.refreshToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    if (!refreshToken) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Refresh token is required");
    }
    const TokenInfo = await auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    ;
    // set the new access token in cookies
    (0, setCookie_1.setAuthCookie)(res, TokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Generated Successfully",
        data: TokenInfo,
    });
});
// logOutUser
const logOutUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // clear the access token cookie 
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        // sameSite: "lax" 
        sameSite: "none"
    });
    // clear the refresh token cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        // sameSite: "lax" 
        sameSite: "none"
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
});
// chang-password is a placeholder for future implementation
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    console.log(decodedToken, 'controller');
    console.log(oldPassword, newPassword);
    await auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed .......... Successfully",
        data: null,
    });
});
exports.AuthControllers = {
    credentialsLogin,
    getNewAccestoken,
    logOutUser,
    changePassword
};
