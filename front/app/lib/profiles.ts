import type { DataPage } from '~/types/page';
import type { Profile } from '~/types/profile';

import type { PageFilters } from './rest-client';
import restClient from './rest-client';

const basePath = '/profiles';

export const fetchProfiles = async (pageFilters: PageFilters): Promise<DataPage<Profile>> => {
  const data = await restClient.getPage<Profile>(basePath, pageFilters);
  return data;
};

export const addProfile = async (profile: Profile): Promise<Profile> => {
  const saved = await restClient.postJson<Profile>(basePath, profile);
  return saved;
};

export const updateProfile = async (profile: Profile): Promise<Profile> => {
  const saved = await restClient.putJson<Profile>(`${basePath}/${profile.code}`, profile);
  return saved;
};

export const deleteProfile = async (profile: Profile): Promise<void> => {
  await restClient.delete(`${basePath}/${profile.code}`);
};
