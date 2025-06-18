import type { DataPage } from '~/types/page';

import type { Wallet } from '~/types/wallet';
import apiClient, { type PageFilters } from './client';

const basePath = (profileCode: string) => `/profiles/${profileCode}/wallets`;

export const fetchWallets = async (
  profileCode: string,
  pageFilters: PageFilters,
): Promise<DataPage<Wallet>> => {
  console.debug('Fetching wallets with filters:', pageFilters);
  const data = await apiClient.getPage<Wallet>(
    basePath(profileCode),
    pageFilters,
  );
  return data;
};

export const addWallet = async (
  profileCode: string,
  wallet: Wallet,
): Promise<Wallet> => {
  console.debug('Adding wallet:', wallet);
  const saved = await apiClient.postJson<Wallet>(basePath(profileCode), wallet);
  return saved;
};

export const updateWallet = async (
  profileCode: string,
  wallet: Wallet,
): Promise<Wallet> => {
  console.debug('Updating wallet:', wallet);
  const saved = await apiClient.putJson<Wallet>(
    `${basePath(profileCode)}/${wallet.code}`,
    wallet,
  );
  return saved;
};

export const deleteWallet = async (
  profileCode: string,
  wallet: Wallet,
): Promise<void> => {
  console.debug('Deleting wallet:', wallet);
  await apiClient.delete(`${basePath(profileCode)}/${wallet.code}`);
};
