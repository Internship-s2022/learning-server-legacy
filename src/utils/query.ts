import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

import { QueryType, SortType } from 'src/interfaces/request';

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

export const formatFilters = (query: qs.ParsedQs) => {
  const { sort: _sort, page: _page, limit: _limit, ...rest } = query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.entries(rest).reduce<Record<string, any>>((prev = {}, [key, value]) => {
    if (key.includes('min')) {
      const newKeys = key.split(/\.(?=[^.]+$)/);
      if (key.toLowerCase().includes('date')) {
        return {
          ...prev,
          [newKeys[0]]: {
            ...prev[newKeys[0]],
            $gte: new Date(value as string),
          },
        };
      }
      return {
        ...prev,
        [newKeys[0]]: {
          ...prev[newKeys[0]],
          $gte: Number(value),
        },
      };
    }
    if (key.includes('max')) {
      const newKeys = key.split(/\.(?=[^.]+$)/);
      if (key.toLowerCase().includes('date')) {
        return {
          ...prev,
          [newKeys[0]]: {
            ...prev[newKeys[0]],
            $lt: new Date(value as string),
          },
        };
      }
      return {
        ...prev,
        [newKeys[0]]: {
          ...prev[newKeys[0]],
          $lt: Number(value),
        },
      };
    }
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
      if (!isNaN(Number(value))) {
        return {
          ...prev,
          [key]: Number(value),
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

export const formatSort = (sort: QueryType | undefined): SortType | undefined => {
  if (typeof sort === 'object') {
    return Object.entries(sort).reduce((acum, [key, value]) => {
      if (value) {
        return {
          ...acum,
          [key]: Number(value),
        };
      }
      return acum;
    }, {});
  }
  return;
};

export const paginateAndFilter = (query: qs.ParsedQs) => {
  const { limit, page, sort, ...rest } = query;
  return {
    query: formatFilters(rest),
    limit: typeof limit === 'string' && limit ? parseInt(limit, 10) : 100,
    page: typeof page === 'string' && page ? parseInt(page, 10) : 1,
    sort: formatSort(sort),
  };
};
