import _ from 'lodash';

export const fetchDataQueries = async ({
  pageParam = 1,
  request,
  params,
  pageSize,
}) => {
  const lastIndex = pageParam * pageSize;
  const firstIndex = lastIndex - pageSize;
  const newParams = {
    ...params,
    range: JSON.stringify([firstIndex, lastIndex - 1]),
  };
  const res = await request(newParams);

  // console.log({ res });
  return {
    data: res?.result?.list || [],
    nextPage: Number(res?.result?.pagination?.current || 0) + 1,
    totalPages: Math.ceil(
      Number(res?.result?.pagination?.total || 1) / Number(pageSize),
    ),
  };
};

export const getDataPages = dataQuery => {
  let paginatedData = [];
  dataQuery?.data?.pages?.forEach(page => {
    page?.data?.forEach(char => {
      paginatedData.push(char);
    });
  });

  paginatedData = _.uniqBy(paginatedData, 'id');
  return paginatedData;
};
export function updateQueryData(newData, key, queryClient) {
  queryClient.setQueryData(key, data => {
    return {
      ...data,
      pages: data.pages.map(page => {
        return {
          ...page,
          data: page.data.map(result => {
            // @ts-ignore
            let item = { ...result };
            if (result.id === newData.id) {
              item = { ...item, ...newData };
            }
            return { ...item };
          }),
        };
      }),
    };
  });
}

export function addQueryData(newData, key, queryClient) {
  queryClient.setQueryData(key, data => {
    return {
      ...data,
      pages: [...data.pages, { data: [newData] }],
    };
  });
}

export function getNextPageParam(lastPage) {
  if (Number(lastPage.nextPage) <= Number(lastPage.totalPages)) {
    return lastPage.nextPage;
  }
  return undefined;
}
