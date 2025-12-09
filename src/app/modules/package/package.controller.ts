import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IPackage, IPackageType } from "./package.interface";
import { PackageService } from "./package.service";


// create Package controller
const createPackage = catchAsync(async (req: Request, res: Response) => {
  const payload: IPackage = req.body;
  const result = await PackageService.createPackage(payload);
  sendResponse(res, { statusCode: 201, success: true, message: "Package created", data: result });
});
//
const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const resData = await PackageService.getAllPackages(req.query as Record<string, string>);
  sendResponse(res, { statusCode: 200, success: true, message: "Packages retrieved", data: resData.data, meta: resData.meta });
});
//
const getSinglePackage = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await PackageService.getSinglePackage(slug);
  sendResponse(res, { statusCode: 200, success: true, message: "Package retrieved", data: result });
});
///
const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: Partial<IPackage> = req.body;
  const result = await PackageService.updatePackage(id, payload);
  sendResponse(res, { statusCode: 200, success: true, message: "Package updated", data: result });
});

////
const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
 
  //  console.log("Deleting package with id:", id);
  const result = await PackageService.deletePackage(id);
  sendResponse(res, { statusCode: 200, success: true, message: "Package deleted", data: result });
});

/* Package Type controllers */
const createPackageType = catchAsync(async (req: Request, res: Response) => {
  const payload: IPackageType = req.body;
  const result = await PackageService.createPackageType(payload);
  sendResponse(res, { statusCode: 201, success: true, message: "Package type created", data: result });
});

const getAllPackageTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackageTypes(req.query as Record<string, string>);
  sendResponse(res, { statusCode: 200, success: true, message: "Package types retrieved", data: result.data, meta: result.meta });
});

const getPackageStats = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getPackageStats();
  sendResponse(res, { statusCode: 200, success: true, message: "Package stats retrieved", data: result });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
  createPackageType,
  getAllPackageTypes,
  getPackageStats,
};
