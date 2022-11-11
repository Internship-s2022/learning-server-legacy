import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export const filterExcludeArrayOfIds = (excludeIds: string[] | string) => {
  if (typeof excludeIds === 'string') {
    return { _id: { $ne: new ObjectId(excludeIds) } };
  }
  return {
    $and: excludeIds.map((id) => ({ _id: { $ne: new ObjectId(id) } })),
  };
};
export const filterIncludeArrayOfIds = (includeIds: string[] | string) => {
  if (typeof includeIds === 'string') {
    return { _id: new ObjectId(includeIds) };
  }
  return {
    _id: { $in: includeIds.map((id) => new ObjectId(id)) },
  };
};

export const filterByIncludes = (query: qs.ParsedQs) => {
  return Object.entries(query).reduce((prev = {}, [key, value]) => {
    if (value === 'true') {
      return {
        ...prev,
        [key]: true,
      };
    }
    if (value === 'false') {
      return {
        ...prev,
        [key]: false,
      };
    }
    if (key === 'excludeIds') {
      return {
        ...prev,
        ...filterExcludeArrayOfIds(value as string[] | string),
      };
    }
    if (key === 'includeIds') {
      return {
        ...prev,
        ...filterIncludeArrayOfIds(value as string[] | string),
      };
    }
    if (typeof value === 'string') {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return {
          ...prev,
          [key]: new ObjectId(value),
        };
      }
      return {
        ...prev,
        [key]: new RegExp(value.toLowerCase(), 'i'),
      };
    }
    return prev;
  }, {});
};

export const paginateAndFilterByIncludes = (query: qs.ParsedQs) => {
  const { limit, page, ...rest } = query;
  return {
    query: filterByIncludes(rest),
    limit: typeof limit === 'string' && limit ? parseInt(limit, 10) : 100,
    page: typeof page === 'string' && page ? parseInt(page, 10) : 1,
  };
};
