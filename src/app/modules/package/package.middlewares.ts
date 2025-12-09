/* eslint-disable @typescript-eslint/no-explicit-any */
// package.middlewares.ts
import { Request, Response, NextFunction } from "express"

export const normalizePackageBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body: any = req.body || {}

  // number fields
  const numberFields = [
    "costFrom",
    "durationDays",
    "capacity",
    "minAge",
    "maxAge",
  ]

  numberFields.forEach((field) => {
    if (body[field] !== undefined) {
      const n = Number(body[field])
      body[field] = Number.isNaN(n) ? undefined : n
    }
  })

  // comma separated → array
  const arrayFromComma = [
    "tags",
    "included",
    "excluded",
    "amenities",
    "itinerary",
  ]

  arrayFromComma.forEach((field) => {
    if (typeof body[field] === "string") {
      body[field] = body[field]
        .split(",")
        .map((v: string) => v.trim())
        .filter((v: string) => v.length > 0)
    }
  })

  
  if (body.images && !Array.isArray(body.images)) {
    body.images = Object.values(body.images)
  }

  req.body = body
  next()
}
