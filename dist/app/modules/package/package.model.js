"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = exports.PackageType = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const mongoose_1 = require("mongoose");
const packageTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
}, { timestamps: true });
exports.PackageType = (0, mongoose_1.model)("PackageType", packageTypeSchema);
const packageSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    summary: { type: String },
    description: { type: String },
    images: { type: [String], default: [] },
    destination: { type: String, index: true },
    costFrom: { type: Number, default: 0 },
    currency: { type: String, default: "BDT" },
    durationDays: { type: Number, default: 1 },
    capacity: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    itinerary: { type: [String], default: [] },
    minAge: { type: Number },
    maxAge: { type: Number },
    division: { type: mongoose_1.Schema.Types.ObjectId, ref: "Division" },
    packageType: { type: mongoose_1.Schema.Types.ObjectId, ref: "PackageType" },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
// generate unique slug before save
packageSchema.pre("save", async function (next) {
    if (this.isModified("title")) {
        const base = this.title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
        let slug = base;
        let counter = 1;
        // @ts-ignore
        while (await exports.Package.exists({ slug })) {
            slug = `${base}-${counter++}`;
        }
        // @ts-ignore
        this.slug = slug;
    }
    next();
});
// generate unique slug before update
packageSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (!update) {
        return next();
    }
    if (update.title) {
        const base = update.title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
        let slug = base;
        let counter = 1;
        // এখানে সরাসরি Package model ব্যবহার করো
        while (await exports.Package.exists({ slug })) {
            slug = `${base}-${counter++}`;
        }
        update.slug = slug;
        this.setUpdate(update);
    }
    next();
});
exports.Package = (0, mongoose_1.model)("Package", packageSchema);
