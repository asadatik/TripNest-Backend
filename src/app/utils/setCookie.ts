import { Response } from "express"

export interface AuthTokens {
  accessToken?: string
  refreshToken?: string
}

const isProd = process.env.NODE_ENV === "production"

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProd, // ⭐ production এ true, লোকালে false
      sameSite: isProd ? "none" : "lax", // ⭐ cross-site এর জন্য none
      // domain set কোরো না Render এ, default থাকুক [web:318][web:324]
    })
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    })
  }
}
