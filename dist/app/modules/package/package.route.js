"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const package_controller_1 = require("./package.controller");
const package_validation_1 = require("./package.validation");
const router = express_1.default.Router();
/* Package types */
router.get("/types", package_controller_1.PackageController.getAllPackageTypes);
// Create Package Type (admin only)
router.post("/types", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), package_controller_1.PackageController.createPackageType);
/* Packages */
router.get("/", package_controller_1.PackageController.getAllPackages);
// Create Package (admin only, with images)
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(package_validation_1.createPackageZodSchema), package_controller_1.PackageController.createPackage);
/* Admin stats (special feature) */
router.get("/stats", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), package_controller_1.PackageController.getPackageStats);
// Get single Package
router.get("/:slug", package_controller_1.PackageController.getSinglePackage);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(package_validation_1.updatePackageZodSchema), package_controller_1.PackageController.updatePackage);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), package_controller_1.PackageController.deletePackage);
exports.PackageRoutes = router;
