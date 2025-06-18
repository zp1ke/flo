import type { Category } from '~/types/category';
import type { DataPage } from '~/types/page';
import apiClient, { type PageFilters } from './client';

const basePath = (profileCode: string) => `/profiles/${profileCode}/categories`;

export const fetchCategories = async (
  profileCode: string,
  pageFilters: PageFilters,
): Promise<DataPage<Category>> => {
  console.debug('Fetching categories with filters:', pageFilters);
  const data = await apiClient.getPage<Category>(
    basePath(profileCode),
    pageFilters,
  );
  return data;
};

export const addCategory = async (
  profileCode: string,
  category: Category,
): Promise<Category> => {
  console.debug('Adding category:', category);
  const saved = await apiClient.postJson<Category>(
    basePath(profileCode),
    category,
  );
  return saved;
};

export const updateCategory = async (
  profileCode: string,
  category: Category,
): Promise<Category> => {
  console.debug('Updating category:', category);
  const saved = await apiClient.putJson<Category>(
    `${basePath(profileCode)}/${category.code}`,
    category,
  );
  return saved;
};

export const deleteCategory = async (
  profileCode: string,
  category: Category,
): Promise<void> => {
  console.debug('Deleting category:', category);
  await apiClient.delete(`${basePath(profileCode)}/${category.code}`);
};
