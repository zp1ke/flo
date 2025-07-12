import type { DataPage } from '~/types/page';

import type { Wallet } from '~/types/wallet';
import apiClient, { type PageFilters } from './client';

const basePath = (profileCode: string) => `/profiles/${profileCode}/wallets`;

export const fetchWallets = async (
  profileCode: string,
  pageFilters: PageFilters,
): Promise<DataPage<Wallet>> => {
  console.debug('Fetching wallets with filters:', pageFilters);
  return await apiClient.getPage<Wallet>(basePath(profileCode), pageFilters);
};

export const addWallet = async (
  profileCode: string,
  wallet: Wallet,
): Promise<Wallet> => {
  console.debug('Adding wallet:', wallet);
  return await apiClient.postJson<Wallet>(basePath(profileCode), wallet);
};

export const updateWallet = async (
  profileCode: string,
  wallet: Wallet,
): Promise<Wallet> => {
  console.debug('Updating wallet:', wallet);
  return await apiClient.putJson<Wallet>(
    `${basePath(profileCode)}/${wallet.code}`,
    wallet,
  );
};

export const deleteWallet = async (
  profileCode: string,
  wallet: Wallet,
): Promise<void> => {
  console.debug('Deleting wallet:', wallet);
  await apiClient.delete(`${basePath(profileCode)}/${wallet.code}`);
};
