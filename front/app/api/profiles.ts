import type { DataPage } from '~/types/page';
import type { Profile } from '~/types/profile';

import apiClient, { type PageFilters } from './client';

const basePath = '/profiles';

export const fetchProfiles = async (): Promise<DataPage<Profile>> => {
  const pageFilters: PageFilters = {
    page: 0,
    size: 100,
  };
  return await apiClient.getPage<Profile>(basePath, pageFilters);
};

export const addProfile = async (profile: Profile): Promise<Profile> => {
  console.debug('Adding profile:', profile);
  return await apiClient.postJson<Profile>(basePath, profile);
};

export const updateProfile = async (profile: Profile): Promise<Profile> => {
  console.debug('Updating profile:', profile);
  return await apiClient.putJson<Profile>(
    `${basePath}/${profile.code}`,
    profile,
  );
};

export const deleteProfile = async (profile: Profile): Promise<void> => {
  console.debug('Deleting profile:', profile);
  await apiClient.delete(`${basePath}/${profile.code}`);
};
