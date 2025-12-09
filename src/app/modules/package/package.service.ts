import { Package, PackageType } from "./package.model";
import { IPackage, IPackageType } from "./package.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { packageSearchableFields } from "./package.constant";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config"; // keep if you have cloudinary util

const createPackage = async (payload: IPackage) => {
  // check duplicate title
  const existing = await Package.findOne({ title: payload.title });
  if (existing) throw new Error("A package with this title already exists.");

  // set availableSeats same as capacity if provided
  if (payload.capacity && !payload.availableSeats) payload.availableSeats = payload.capacity;

  const created = await Package.create(payload);
  return created;
};

const getAllPackages = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(Package.find(), query);
  const packagesQuery = qb.search(packageSearchableFields).filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([packagesQuery.build(), qb.getMeta()]);

  return { data, meta };
};

// get single package
const getSinglePackage = async (slug: string) => {
  const pkg = await Package.findOne({ slug }).populate("packageType").lean();
  if (!pkg) throw new Error("Package not found.");
  return pkg;
};


// update package

const updatePackage = async (id: string, payload: Partial<IPackage>) => {
  const existing = await Package.findById(id);
  if (!existing) throw new Error("Package not found.");

  const updated = await Package.findByIdAndUpdate(id, payload, { new: true });



  return updated;
};
///////
const deletePackage = async (id: string) => {
  const existing = await Package.findById(id);
  if (!existing) throw new Error("Package not found.");
  // delete images from cloud
  if (existing.images && existing.images.length > 0) {
    await Promise.all(existing.images.map((url) => deleteImageFromCLoudinary(url)));
  }
  return await Package.findByIdAndDelete(id);
};


////
const createPackageType = async (payload: IPackageType) => {
  const exist = await PackageType.findOne({ name: payload.name });
  if (exist) throw new Error("Package type already exists.");
  return await PackageType.create(payload);
};


//////
const getAllPackageTypes = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(PackageType.find(), query);
  const typesQuery = qb.search(["name"]).filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([typesQuery.build(), qb.getMeta()]);
  return { data, meta };
};


// get package stats

const getPackageStats = async () => {
  const totalPackages = await Package.countDocuments();
  const totalTypes = await PackageType.countDocuments();

  const upcoming = await Package.countDocuments({ startDate: { $gte: new Date() } });
  const past = await Package.countDocuments({ endDate: { $lte: new Date() } });

  const avgCostAgg = await Package.aggregate([{ $group: { _id: null, avg: { $avg: "$costFrom" } } }]);
  const avgCost = avgCostAgg.length ? avgCostAgg[0].avg : 0;

  const topExpensive = await Package.find().sort({ costFrom: -1 }).limit(5).select("title costFrom slug");

  return { totalPackages, totalTypes, upcoming, past, averageCost: avgCost, topExpensive };
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
  createPackageType,
  getAllPackageTypes,
  getPackageStats,
};
