"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const package_model_1 = require("./package.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const package_constant_1 = require("./package.constant");
const cloudinary_config_1 = require("../../config/cloudinary.config"); // keep if you have cloudinary util
const createPackage = async (payload) => {
    // check duplicate title
    const existing = await package_model_1.Package.findOne({ title: payload.title });
    if (existing)
        throw new Error("A package with this title already exists.");
    // set availableSeats same as capacity if provided
    if (payload.capacity && !payload.availableSeats)
        payload.availableSeats = payload.capacity;
    const created = await package_model_1.Package.create(payload);
    return created;
};
const getAllPackages = async (query) => {
    const qb = new QueryBuilder_1.QueryBuilder(package_model_1.Package.find(), query);
    const packagesQuery = qb.search(package_constant_1.packageSearchableFields).filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([packagesQuery.build(), qb.getMeta()]);
    return { data, meta };
};
// get single package
const getSinglePackage = async (slug) => {
    const pkg = await package_model_1.Package.findOne({ slug }).populate("packageType").lean();
    if (!pkg)
        throw new Error("Package not found.");
    return pkg;
};
// update package
const updatePackage = async (id, payload) => {
    const existing = await package_model_1.Package.findById(id);
    if (!existing)
        throw new Error("Package not found.");
    const updated = await package_model_1.Package.findByIdAndUpdate(id, payload, { new: true });
    return updated;
};
///////
const deletePackage = async (id) => {
    const existing = await package_model_1.Package.findById(id);
    if (!existing)
        throw new Error("Package not found.");
    // delete images from cloud
    if (existing.images && existing.images.length > 0) {
        await Promise.all(existing.images.map((url) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    return await package_model_1.Package.findByIdAndDelete(id);
};
////
const createPackageType = async (payload) => {
    const exist = await package_model_1.PackageType.findOne({ name: payload.name });
    if (exist)
        throw new Error("Package type already exists.");
    return await package_model_1.PackageType.create(payload);
};
//////
const getAllPackageTypes = async (query) => {
    const qb = new QueryBuilder_1.QueryBuilder(package_model_1.PackageType.find(), query);
    const typesQuery = qb.search(["name"]).filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([typesQuery.build(), qb.getMeta()]);
    return { data, meta };
};
// get package stats
const getPackageStats = async () => {
    const totalPackages = await package_model_1.Package.countDocuments();
    const totalTypes = await package_model_1.PackageType.countDocuments();
    const upcoming = await package_model_1.Package.countDocuments({ startDate: { $gte: new Date() } });
    const past = await package_model_1.Package.countDocuments({ endDate: { $lte: new Date() } });
    const avgCostAgg = await package_model_1.Package.aggregate([{ $group: { _id: null, avg: { $avg: "$costFrom" } } }]);
    const avgCost = avgCostAgg.length ? avgCostAgg[0].avg : 0;
    const topExpensive = await package_model_1.Package.find().sort({ costFrom: -1 }).limit(5).select("title costFrom slug");
    return { totalPackages, totalTypes, upcoming, past, averageCost: avgCost, topExpensive };
};
exports.PackageService = {
    createPackage,
    getAllPackages,
    getSinglePackage,
    updatePackage,
    deletePackage,
    createPackageType,
    getAllPackageTypes,
    getPackageStats,
};
