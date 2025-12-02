import {  Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema, } from "./userValidation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";


const router = Router()


//
router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser)
//
router.get("/all-users", checkAuth(UserRole.ADMIN), UserControllers.getAllUsers)
//
router.get("/me", checkAuth(...Object.values(UserRole)), UserControllers.getMe)
//
// router.get(  '/senders', checkAuth( UserRole.ADMIN ) ,   UserControllers.getAllSender,);
// //
// router.get('/receivers' , checkAuth( UserRole.ADMIN , UserRole. ) , UserControllers.getAllReceiver,
// );


// 
router.get("/:id", checkAuth(UserRole.ADMIN), UserControllers.getSingleUser)
//
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(UserRole)), UserControllers.updateUser)



export const UserRoutes = router


