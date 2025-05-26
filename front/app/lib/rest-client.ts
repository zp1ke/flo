import axios, { type AxiosInstance } from 'axios';
import config from '~/config';
import type { DataPage } from '~/types/page';
import { SortDirection, sortPrefix } from '~/types/sort';

import { getAuthToken } from './auth';

export interface RestError {
  message: string;
}

export interface PageFilters {
  page: number;
  size: number;
  sort?: Record<string, SortDirection>;
  filters?: Record<string, any>;
}

type RestPage<T> = {
  list: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

class RestClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: 5_000,
    });
  }

  async getPage<T>(url: string, pageFilters?: PageFilters): Promise<DataPage<T>> {
    try {
      const response = await this.axios.get<RestPage<T>>(url, {
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

  async postJson<T>(url: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await this.axios.post<T>(url, data, { headers: headers() });
      return response.data;
    } catch (error) {
      throw parseError(error);
    }
  }
}

const headers = (): Record<string, string> => {
  const authToken = getAuthToken();
  return {
    'Content-Type': 'application/json',
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
      Object.entries(pageFilters.sort).forEach(([key, value]) => {
        const theKey = key.startsWith(sortPrefix) ? key.substring(sortPrefix.length) : key;
        params.append('sort', `${theKey},${value}`);
      });
    }
    if (pageFilters.filters) {
      Object.entries(pageFilters.filters).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
  }
  return params;
};

const parseError = (error: unknown): RestError => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return {
      ...error.response.data,
      message: 'rest.' + (error.response.data.message || 'unknownError'),
    } satisfies RestError;
  }
  if (error instanceof Error) {
    return { message: error.message } satisfies RestError;
  }
  if (typeof error === 'string') {
    return { message: error } satisfies RestError;
  }
  return { message: 'rest.unknownError' } satisfies RestError;
};

const restClient = new RestClient(config.restApiBaseUrl);

export default restClient;
