/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelper/appError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";


import { createNewAccessTokenWithRefreshToken, } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";




// credentialsLogin

    const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Invalid Password');
  }

  return isUserExist;
};




// getNewAccessToken by refresh token  

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}

// changePassword 

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId);
  console.log(oldPassword, newPassword, decodedToken);
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user?.password as string,
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your old password not matched!');
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  user!.save();
};





export const AuthServices = {
    credentialsLogin,
    resetPassword,
    getNewAccessToken ,
  

}