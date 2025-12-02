
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express"
import { ZodObject, ZodRawShape } from "zod"

export const validateRequest =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🚀 ~ validateRequest ~ incoming body:", req.body)
      
      req.body = await zodSchema.parseAsync(req.body)

      console.log("🚀 ~ validateRequest ~ parsed body:", req.body)

      next()
    } catch (error) {
      next(error)
    }
  }
