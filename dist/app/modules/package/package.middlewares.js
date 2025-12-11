"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePackageBody = void 0;
const normalizePackageBody = (req, res, next) => {
    const body = req.body || {};
    // number fields
    const numberFields = [
        "costFrom",
        "durationDays",
        "capacity",
        "minAge",
        "maxAge",
    ];
    numberFields.forEach((field) => {
        if (body[field] !== undefined) {
            const n = Number(body[field]);
            body[field] = Number.isNaN(n) ? undefined : n;
        }
    });
    // comma separated → array
    const arrayFromComma = [
        "tags",
        "included",
        "excluded",
        "amenities",
        "itinerary",
    ];
    arrayFromComma.forEach((field) => {
        if (typeof body[field] === "string") {
            body[field] = body[field]
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
        }
    });
    if (body.images && !Array.isArray(body.images)) {
        body.images = Object.values(body.images);
    }
    req.body = body;
    next();
};
exports.normalizePackageBody = normalizePackageBody;
