"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const package_service_1 = require("./package.service");
// create Package controller
const createPackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await package_service_1.PackageService.createPackage(payload);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, success: true, message: "Package created", data: result });
});
//
const getAllPackages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const resData = await package_service_1.PackageService.getAllPackages(req.query);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Packages retrieved", data: resData.data, meta: resData.meta });
});
//
const getSinglePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const slug = req.params.slug;
    const result = await package_service_1.PackageService.getSinglePackage(slug);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Package retrieved", data: result });
});
///
const updatePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await package_service_1.PackageService.updatePackage(id, payload);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Package updated", data: result });
});
////
const deletePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    //  console.log("Deleting package with id:", id);
    const result = await package_service_1.PackageService.deletePackage(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Package deleted", data: result });
});
/* Package Type controllers */
const createPackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await package_service_1.PackageService.createPackageType(payload);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, success: true, message: "Package type created", data: result });
});
const getAllPackageTypes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await package_service_1.PackageService.getAllPackageTypes(req.query);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Package types retrieved", data: result.data, meta: result.meta });
});
const getPackageStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await package_service_1.PackageService.getPackageStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Package stats retrieved", data: result });
});
exports.PackageController = {
    createPackage,
    getAllPackages,
    getSinglePackage,
    updatePackage,
    deletePackage,
    createPackageType,
    getAllPackageTypes,
    getPackageStats,
};
