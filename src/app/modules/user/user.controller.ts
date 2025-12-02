/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";

import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

import { JwtPayload } from "jsonwebtoken";

//create 
const createUser = async (req: Request, res: Response  , next : NextFunction) => {
  try {
   
    const user = await UserServices.createUser(req.body)

    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user
    })
  }
  
 catch (err: any) {
     console.log(
        "🚀 ~ file: user.controller.ts ~ line 15 ~ createUser ~ error",
        next(err)
     )
       
}

}


// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers(req.query as Record<string, string>,);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: users.data,
    meta: users.meta
  });
});



// get All Sender
// const getAllSender = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const data = await UserServices.getAllSender(
//       req.query as Record<string, string>,
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'Sender retrieved Successfully',
//       data,
//     });
//   },
// );

// // get All  Receiver
// const getAllReceiver = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const data = await UserServices.getAllReceiver(
//       req.query as Record<string, string>,
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'Receiver retrieved Successfully',
//       data,
//     });
//   },
// );



// update user
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;


    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)



    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})

// get own profile
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);
 
      console.log(
        "🚀 ~ file: user.controller.ts ~ line 94 ~ getMe ~ result",
        result
      )
   
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})


// getSingleUser 
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})



export const UserControllers = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  updateUser , 
  // getAllReceiver, 
  // getAllSender





}
