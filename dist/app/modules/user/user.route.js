"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const userValidation_1 = require("./userValidation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
//
router.post("/register", (0, validateRequest_1.validateRequest)(userValidation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
// checkAuth( UserRole.ADMIN ) baki acee
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), user_controller_1.UserControllers.getAllUsers);
//
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserControllers.getMe);
//
// router.get(  '/senders', checkAuth( UserRole.ADMIN ) ,   UserControllers.getAllSender,);
// //
// router.get('/receivers' , checkAuth( UserRole.ADMIN , UserRole. ) , UserControllers.getAllReceiver,
// );
// dlt user
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), user_controller_1.UserControllers.getSingleUser);
//
router.patch("/:id", (0, validateRequest_1.validateRequest)(userValidation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserControllers.updateUser);
exports.UserRoutes = router;
