import { Query } from 'mongoose';
import { ReqQuery } from '../types/api.types';
import { ParsedUrlQuery } from 'querystring';

export class APIFeatures<T> {
  modelQuery: Query<T[], T>;
  reqQuery: ParsedUrlQuery;

  constructor(modelQuery: Query<T[], T>, reqQuery: ParsedUrlQuery) {
    this.modelQuery = modelQuery;
    this.reqQuery = reqQuery;
  }

  filter() {
    const excludedFields = ['sort', 'fields', 'page', 'limit'];
    const filterObj = { ...this.reqQuery };
    excludedFields.forEach((field) => delete filterObj?.[field]);

    // append $ to gt lt gte lte
    let queryString = JSON.stringify(filterObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    this.modelQuery = this.modelQuery.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.reqQuery?.sort) {
      // sort = price,duration
      const sortFields = (this.reqQuery.sort as string).split(',').join(' ');

      this.modelQuery = this.modelQuery.sort(sortFields);
    } else {
      // default
      this.modelQuery = this.modelQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery?.fields) {
      const fields = (this.reqQuery.fields as string).split(',').join(' ');
      this.modelQuery = this.modelQuery.select(fields);
    }

    return this;
  }

  paginate() {
    const page = Number(this.reqQuery?.page) || 1;
    const limit = Number(this.reqQuery?.limit) || 50;

    const skipXResults = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skipXResults).limit(limit);

    return this;
  }
}
