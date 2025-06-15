import type { DataPage } from '~/types/page';
import type { Profile } from '~/types/profile';

import apiClient, { type PageFilters } from './client';
const basePath = '/profiles';

export const fetchProfiles = async (): Promise<DataPage<Profile>> => {
  const pageFilters: PageFilters = {
    page: 0,
    size: 100,
  };
  const data = await apiClient.getPage<Profile>(basePath, pageFilters);
  return data;
};

export const addProfile = async (profile: Profile): Promise<Profile> => {
  console.debug('Adding profile:', profile);
  const saved = await apiClient.postJson<Profile>(basePath, profile);
  return saved;
};

export const updateProfile = async (profile: Profile): Promise<Profile> => {
  console.debug('Updating profile:', profile);
  const saved = await apiClient.putJson<Profile>(`${basePath}/${profile.code}`, profile);
  return saved;
};

export const deleteProfile = async (profile: Profile): Promise<void> => {
  console.debug('Deleting profile:', profile);
  await apiClient.delete(`${basePath}/${profile.code}`);
};
