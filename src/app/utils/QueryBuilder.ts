

import { Query } from "mongoose";
import { excludeField } from "../constants";
export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  private filterQuery: Record<string, unknown> = {};
  private searchQuery: Record<string, unknown> = {};

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter: Record<string, unknown> = { ...this.query };

    excludeField.forEach(f => delete filter[f]);

    this.filterQuery = filter;

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchableField: string[]): this {
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

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
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
      .find({ ...this.filterQuery, ...this.searchQuery });

    const totalDocuments = await countQuery.countDocuments();
    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
