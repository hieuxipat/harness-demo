import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const convertParamsToQueryString = <T extends object>(params: T) =>
  Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

export const convertQueryStringToObject = (queryString: string) => {
  if (!queryString) {
    return null;
  }
  return JSON.parse(
    `{"${decodeURI(queryString.substring(1))
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')}"}`
  );
};

export const customApi = {
  get<T, P extends object>(
    url: string,
    params: P,
    config?: AxiosRequestConfig
  ) {
    return axiosClient.get<T>(
      `${url}?${convertParamsToQueryString(params)}`,
      config
    );
  },

  post<T, D>(url: string, data: D, config?: AxiosRequestConfig) {
    return axiosClient.post<T>(url, data, config);
  },

  patch<T, D>(url: string, data: D, config?: AxiosRequestConfig) {
    return axiosClient.patch<T>(url, data, config);
  },

  put<T, D>(url: string, data: D, config?: AxiosRequestConfig) {
    return axiosClient.put<T>(url, data, config);
  },

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return axiosClient.delete<T>(url, config);
  }
};
