"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.filterQuery = {};
        this.searchQuery = {};
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        constants_1.excludeField.forEach(f => delete filter[f]);
        this.filterQuery = filter;
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    search(searchableField) {
        const term = this.query.searchTerm;
        if (term) {
            const search = {
                $or: searchableField.map(field => ({
                    [field]: { $regex: term, $options: "i" },
                })),
            };
            this.searchQuery = search;
            this.modelQuery = this.modelQuery.find(search);
        }
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    async getMeta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        // Count uses same filter+search but no pagination
        const countQuery = this.modelQuery.model
            .find(Object.assign(Object.assign({}, this.filterQuery), this.searchQuery));
        const totalDocuments = await countQuery.countDocuments();
        const totalPage = Math.ceil(totalDocuments / limit);
        return { page, limit, total: totalDocuments, totalPage };
    }
}
exports.QueryBuilder = QueryBuilder;
