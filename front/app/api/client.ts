import axios, { type AxiosInstance } from 'axios';
import config from '~/config';
import type { DataPage } from '~/types/page';
import { type SortDirection, sortPrefix } from '~/types/sort';

import { getLanguage } from '~/lib/i18n';
import useUserStore from '~/store/user-store';

export interface ApiError {
  message: string;
  status: number;
}

export interface PageFilters {
  page: number;
  size: number;
  sort?: Record<string, SortDirection>;
  filters?: Record<string, unknown>;
}

type ApiPage<T> = {
  list: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

class ApiClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: 5_000,
    });
  }

  async getPage<T>(url: string, pageFilters?: PageFilters): Promise<DataPage<T>> {
    try {
      const response = await this.axios.get<ApiPage<T>>(url, {
        params: paramsFrom(pageFilters),
        headers: headers(),
      });
      return {
        data: response.data.list,
        total: response.data.totalElements,
      };
    } catch (error) {
      throw parseError(error);
    }
  }

  async getJson<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axios.get<T>(url, {
        params: parseParams(params),
        headers: headers(),
      });
      return response.data;
    } catch (error) {
      throw parseError(error);
    }
  }

  async postJson<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axios.post<T>(url, data, { headers: headers() });
      return response.data;
    } catch (error) {
      throw parseError(error);
    }
  }

  async putJson<T>(url: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axios.put<T>(url, data, { headers: headers() });
      return response.data;
    } catch (error) {
      throw parseError(error);
    }
  }

  async delete(url: string, params?: Record<string, unknown>): Promise<void> {
    try {
      const response = await this.axios.delete(url, {
        params: parseParams(params),
        headers: headers(),
      });
      return response.data;
    } catch (error) {
      throw parseError(error);
    }
  }
}

const headers = (): Record<string, string> => {
  const authToken = useUserStore.getState().token;
  return {
    'Content-Type': 'application/json',
    'Accept-Language': getLanguage(),
    Accept: 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

const paramsFrom = (pageFilters?: PageFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (pageFilters) {
    params.set('page', pageFilters.page.toString());
    params.set('size', pageFilters.size.toString());
    if (pageFilters.sort) {
      for (const [key, value] of Object.entries(pageFilters.sort)) {
        const theKey = key.startsWith(sortPrefix) ? key.substring(sortPrefix.length) : key;
        params.append('sort', `${theKey},${value}`);
      }
    }
    if (pageFilters.filters) {
      for (const [key, value] of Object.entries(pageFilters.filters)) {
        params.set(key, String(value));
      }
    }
  }
  return params;
};

const parseParams = (params?: Record<string, unknown>): URLSearchParams => {
  const parsedParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params || {})) {
      if (value !== undefined && value !== null) {
        parsedParams.set(key, String(value));
      }
    }
  }
  return parsedParams;
};

const parseError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const status = error.response.status || 0;
    if (status === 401) {
      useUserStore.getState().clean();
    }

    return {
      ...error.response.data,
      message: `api.${error.response.data.message || 'unknownError'}`,
      status,
    } satisfies ApiError;
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 } satisfies ApiError;
  }
  if (typeof error === 'string') {
    return { message: error, status: 0 } satisfies ApiError;
  }
  return { message: 'api.unknownError', status: 0 } satisfies ApiError;
};

const apiClient = new ApiClient(config.apiBaseUrl);

export default apiClient;
