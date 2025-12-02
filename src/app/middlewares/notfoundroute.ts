import { Request, Response } from "express";
import httpStatus from "http-status-codes";


const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Route Not Found (404)",
        error: "Not Found",
        stack: process.env.NODE_ENV === "production" ? "No Stack Found" : new Error().stack,
    })
}

export default notFound ; 