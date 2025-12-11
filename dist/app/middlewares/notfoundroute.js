"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const notFound = (req, res) => {
    res.status(http_status_codes_1.default.NOT_FOUND).json({
        success: false,
        message: "Route Not Found (404)",
        error: "Not Found",
        stack: process.env.NODE_ENV === "production" ? "No Stack Found" : new Error().stack,
    });
};
exports.default = notFound;
