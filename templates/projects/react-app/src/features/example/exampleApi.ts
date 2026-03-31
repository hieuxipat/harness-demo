import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ExampleItem {
  id: string;
  name: string;
}

export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Example'],
  endpoints: (builder) => ({
    getExamples: builder.query<ExampleItem[], void>({
      query: () => '/examples',
      providesTags: ['Example'],
    }),
    createExample: builder.mutation<ExampleItem, Partial<ExampleItem>>({
      query: (body) => ({
        url: '/examples',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Example'],
    }),
  }),
});

export const { useGetExamplesQuery, useCreateExampleMutation } = exampleApi;
