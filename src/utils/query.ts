export const filterByIncludes = (query: qs.ParsedQs) => {
  return Object.entries(query).reduce((prev, [key, value]) => {
    if (typeof value === 'string') {
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
