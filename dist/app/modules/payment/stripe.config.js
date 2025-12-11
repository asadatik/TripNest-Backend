"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../../config/env"); // adjust path to your env util
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || env_1.envVars.STRIPE_SECRET_KEY;
exports.stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2025-11-17.clover",
});
