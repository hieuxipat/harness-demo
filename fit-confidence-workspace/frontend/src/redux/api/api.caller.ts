import { createApi } from '@reduxjs/toolkit/query/react';
import { IResponseInfo } from 'interfaces';
import customBaseQuery from './fetchBase';

export const apiCaller = createApi({
  reducerPath: 'apiCaller',
  refetchOnMountOrArgChange: 30,
  baseQuery: customBaseQuery(),
  tagTypes: [],
  endpoints: (builder) => ({
    getExample: builder.query<IResponseInfo, void>({
      query() {
        return {
          url: `example`,
          method: 'GET'
        };
      }
    })
  })
});

export const { useGetExampleQuery, useLazyGetExampleQuery } = apiCaller;
