"use strict";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./app/routes");
const globalerrorhandler_1 = require("./app/middlewares/globalerrorhandler");
const notfoundroute_1 = __importDefault(require("./app/middlewares/notfoundroute"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
// CORS
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));
// 🔵 Normal body parsers (webhook রুট আমরা PaymentRoutes এর ভেতর raw হিসেবে হ্যান্ডেল করব)
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// সব API রুট
app.use("/api/v1/", routes_1.router);
app.get("/", (req, res) => {
    res.send("Welcome to library App");
});
// Global error handler
app.use(globalerrorhandler_1.globalErrorHandler);
// Handle not found routes
app.use(notfoundroute_1.default);
exports.default = app;
