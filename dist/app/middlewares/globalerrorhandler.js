"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = __importDefault(require("../errorHelper/appError"));
const env_1 = require("../config/env");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handlerZodError_1 = require("../helpers/handlerZodError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const globalErrorHandler = (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    let errorSources = [];
    let statusCode = 500;
    let message = "Something Went Wrong!!";
    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handlerDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    //Zod Error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handlerZodError_1.handlerZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handlerValidationError_1.handlerValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    //App Error
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    //Unhandled Rejection
    else if (err.name === "UnhandledRejection") {
        statusCode = 500;
        message = err.message || "Something went wrong";
    }
    //Unhandled Error
    else if (err.name === "UnhandledError") {
        statusCode = 500;
        message = err.message || "Something went wrong";
    }
    //Other Errors
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
