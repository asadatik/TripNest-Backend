/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"

import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelper/appError"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserTokens } from "../../utils/userTokens"

// credentialsLogin

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    if (!loginInfo) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials")
    }

    const userToken = createUserTokens(loginInfo);

    setAuthCookie(res, userToken);

 // Remove password from the user object before returning

    const { password, ...rest } = loginInfo.toObject();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
      data: {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest,
      },
    });
  },
);


//  gwtNewAccestoken      

const getNewAccestoken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken  = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
  
    if (!refreshToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required")
    }


   const TokenInfo = await AuthServices.getNewAccessToken(refreshToken  as string); ;

    // set the new access token in cookies
    setAuthCookie(res, TokenInfo)

sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Generated Successfully",
        data: TokenInfo,
    })
    
}
)  




// logOutUser
const logOutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    
    // clear the access token cookie 
    res.clearCookie("accessToken" ,  {  
        httpOnly: true,
        secure: true ,
        // sameSite: "lax" 
        sameSite : "none"
       }  );

    // clear the refresh token cookie
    res.clearCookie("refreshToken"
        , {  
        httpOnly: true,
        secure: true ,
        // sameSite: "lax" 
        sameSite : "none"

       }
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })

})







// chang-password is a placeholder for future implementation

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user
        console.log(decodedToken ,'controller' )
        console.log(oldPassword, newPassword)


    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed .......... Successfully",
        data: null,
    })
})






export const AuthControllers = {
    credentialsLogin,
    getNewAccestoken ,
    logOutUser,
    changePassword

   
}