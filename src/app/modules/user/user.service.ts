
import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IUser, UserRole} from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import AppError from "../../errorHelper/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";

// create a new user
const createUser = async (payload: Partial<IUser>) => {
    const { email, password , ...rest} = payload;


    // check if user already exists
    const isUserExit = await User.findOne({ email });
    
    if (isUserExit) {

        throw new Error("User already exists with this email");
    }


    const hashedPassword = await bcryptjs.hash(password as string, 10)



        const authProvider : IAuthProvider = {
        provider: "credentials",
        providerId: email as string,
        }



    
    const user = await User.create({
        email,
        password: hashedPassword,
        auths : [authProvider],
       ...rest
    })

    return   user

}



// get all users

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};



// 
// const getAllSender = async (filters: Record<string, string>, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;
//   const senders = await User.find({ role: UserRole.AGENT, ...filters })
//     .select("-password")
//     .skip(skip)
//     .limit(limit);
//   const total = await User.countDocuments({ role: UserRole.AGENT, ...filters });
//   return {
//     data: senders,
//     meta: { total, page, limit }
//   };
// };


// //

// const getAllReceiver = async (filters: Record<string, string>, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;
//   const receivers = await User.find({ role: Role.RECEIVER, ...filters })
//     .select("-password")
//     .skip(skip)
//     .limit(limit);
//   const total = await User.countDocuments({ role: Role.RECEIVER, ...filters });

//   return {
//     data: receivers,
//     meta: { total, page, limit }
//   };
// };





// update user

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);



    // Check if user exists
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }


    // Check if the user is trying to update their own profile or an admin is updating another user
   
   
    if (ifUserExist.email !== decodedToken.email && decodedToken.role !== UserRole.ADMIN) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to update this user")
    }



    // If role is being updated, check if the user is an admin and if the new role is valid

if (payload.role) {

   
    if (decodedToken.role !== UserRole.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can update user roles");
    }

    // Step 3: Check if role is valid
    if (!Object.values(UserRole).includes(payload.role as UserRole)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid role provided");
    }
}

    // If password is being updated, hash it
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, 10);
    }
    
     

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

// get single user

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};


// get me
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};


export const UserServices = {


    createUser,
    getAllUsers ,
    updateUser ,
    getSingleUser ,
    getMe ,
  
    
}
