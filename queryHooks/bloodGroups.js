import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from 'react-query';
import { query, info, del, add, update } from '~/services/bloodGroupsRedux';
import {
  fetchDataQueries,
  updateQueryData,
  addQueryData,
  getDataPages,
  getNextPageParam,
} from './utils';

// 1. Fetch tất cả products
export const useData = (init = {}, options = {}) => {
  const { params, key = 'bloodGroups' } = init;
  return useQuery(key, () => query(params), options);
};

export const useInfinitiData = (init = {}, options = {}) => {
  const { params, pageSize = 1, key = 'infiniti-bloodGroups' } = init;
  const queryClient = useQueryClient();
  // console.log('params', params);

  const dataQuery = useInfiniteQuery(
    key,
    async ({ pageParam = 1 }) =>
      fetchDataQueries({
        pageParam,
        request: query,
        params,
        pageSize,
      }),
    {
      ...options,
      getNextPageParam: getNextPageParam,
    },
  );

  // console.log({ dataQuery });
  return {
    ...dataQuery,
    results: getDataPages(dataQuery),
    updateQueryData: newData => updateQueryData(newData, key, queryClient),
    addQueryData: newData => addQueryData(newData, key, queryClient),
  };
};

// 2. Fetch một product cụ thể
export const useInfo = (init = {}, options = {}) => {
  //  console.log('fwetch detail');
  const { id, key = 'bloodGroup' } = init;
  // console.log({ id });
  return useQuery(key, () => info(id), options);
};

export const useAddData = options => {
  return useMutation(add, options);
};

export const useDelData = options => {
  return useMutation(del, options);
};

export const useUpdateData = options => {
  return useMutation(update, options);
};
