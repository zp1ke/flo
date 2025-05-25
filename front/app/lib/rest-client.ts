import axios, { type AxiosInstance } from 'axios';
import config from '~/config';
import type { DataPage } from '~/types/page';
import { SortDirection, sortPrefix } from '~/types/sort';

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
      timeout: 1000,
    });
  }

  async getPage<T>(url: string, pageFilters?: PageFilters): Promise<DataPage<T>> {
    try {
      const response = await this.axios.get<RestPage<T>>(url, { params: paramsFrom(pageFilters) });
      return {
        data: response.data.list,
        total: response.data.totalElements,
      };
    } catch (error) {
      throw new Error(`GET request failed: ${error}`);
    }
  }
}

const paramsFrom = (pageFilters?: PageFilters): Record<string, any> => {
  const params: Record<string, any> = {};
  if (pageFilters) {
    params.page = pageFilters.page;
    params.size = pageFilters.size;
    if (pageFilters.sort) {
      Object.entries(pageFilters.sort).forEach(([key, value]) => {
        const theKey = key.startsWith(sortPrefix) ? key.substring(sortPrefix.length) : key;
        params[theKey] = value;
      });
    }
    if (pageFilters.filters) {
      Object.entries(pageFilters.filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
  }
  return params;
};

const restClient = new RestClient(config.restApiBaseUrl);

export default restClient;
