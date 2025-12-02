import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { PackageController } from "./package.controller";
import { createPackageZodSchema, updatePackageZodSchema } from "./package.validation";

const router = express.Router();

/* Package types */
router.get("/types", PackageController.getAllPackageTypes);

// Create Package Type (admin only)
router.post("/types", checkAuth(UserRole.ADMIN), PackageController.createPackageType);

/* Packages */
router.get("/", PackageController.getAllPackages);


// Create Package (admin only)
router.post( "/create",checkAuth(UserRole.ADMIN),validateRequest(createPackageZodSchema),
  PackageController.createPackage
);


/* Admin stats (special feature) */
router.get("/stats", checkAuth(UserRole.ADMIN), PackageController.getPackageStats);


// Get single Package
router.get("/:slug", PackageController.getSinglePackage);
router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(updatePackageZodSchema),
  PackageController.updatePackage
);

router.delete("/:id", checkAuth(UserRole.ADMIN), PackageController.deletePackage);



export const PackageRoutes = router;
