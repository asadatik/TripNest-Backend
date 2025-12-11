"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
// credentialsLogin
const credentialsLogin = async (payload) => {
    const { email, password } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User not found');
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatched) {
        throw new appError_1.default(http_status_codes_1.default.BAD_GATEWAY, 'Invalid Password');
    }
    return isUserExist;
};
// getNewAccessToken by refresh token  
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
};
// changePassword 
const resetPassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    console.log(oldPassword, newPassword, decodedToken);
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isOldPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Your old password not matched!');
    }
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
};
exports.AuthServices = {
    credentialsLogin,
    resetPassword,
    getNewAccessToken,
};
