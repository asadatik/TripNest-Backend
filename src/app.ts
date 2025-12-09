/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalerrorhandler";
import notFound from "./app/middlewares/notfoundroute";

const app = express();

app.use(cookieParser());
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// 🔵 Normal body parsers (webhook রুট আমরা PaymentRoutes এর ভেতর raw হিসেবে হ্যান্ডেল করব)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// সব API রুট
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library App");
});

// Global error handler
app.use(globalErrorHandler);

// Handle not found routes
app.use(notFound);

export default app;
