import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", API_KEY);
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com",
      );

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=${params.length || 3}`,
    }),
    getTextSummary: builder.query({
      query: (params) => ({
        url: "/summarize-text",
        method: "POST",
        body: {
          text: params.text,
          length: params.length || 3,
        },
      }),
    }),
    getParaphrase: builder.query({
      query: (params) => ({
        url: "/rewrite",
        method: "POST",
        body: {
          text: params.text,
          tone: params.tone || "standard",
        },
      }),
    }),
  }),
});

export const {
  useLazyGetSummaryQuery,
  useLazyGetTextSummaryQuery,
  useLazyGetParaphraseQuery,
} = articleApi;
