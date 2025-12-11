"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserTokens = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorHelper/appError"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("./jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserTokens = createUserTokens;
const createNewAccessTokenWithRefreshToken = async (refreshToken) => {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = await user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    if (isUserExist.status === user_interface_1.AccountStatus.BLOCKED || isUserExist.status === user_interface_1.AccountStatus.INACTIVE) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.status}`);
    }
    if (isUserExist.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return accessToken;
};
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
