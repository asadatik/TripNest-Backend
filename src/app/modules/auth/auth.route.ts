
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

import { UserRole } from "../user/user.interface";
import { Router } from "express";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccestoken)
router.post("/logout", AuthControllers.logOutUser)
router.post("/change-password", checkAuth(...Object.values(UserRole)) , AuthControllers.changePassword) // Assuming this is a placeholder for future implementation







export const AuthRoutes = router;