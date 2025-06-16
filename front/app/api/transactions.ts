import type { DataPage } from '~/types/page';

import type { Transaction } from '~/types/transaction';
import apiClient, { type PageFilters } from './client';

const basePath = (profileCode: string) => `/profiles/${profileCode}/transactions`;

export const fetchTransactions = async (
  profileCode: string,
  pageFilters: PageFilters,
): Promise<DataPage<Transaction>> => {
  console.debug('Fetching transactions with filters:', pageFilters);
  const data = await apiClient.getPage<Transaction>(basePath(profileCode), pageFilters);
  return data;
};

export const addTransaction = async (
  profileCode: string,
  transaction: Transaction,
): Promise<Transaction> => {
  console.debug('Adding transaction:', transaction);
  const saved = await apiClient.postJson<Transaction>(basePath(profileCode), transaction);
  return saved;
};

export const updateTransaction = async (
  profileCode: string,
  transaction: Transaction,
): Promise<Transaction> => {
  console.debug('Updating transaction:', transaction);
  const saved = await apiClient.putJson<Transaction>(
    `${basePath(profileCode)}/${transaction.code}`,
    transaction,
  );
  return saved;
};

export const deleteTransaction = async (
  profileCode: string,
  transaction: Transaction,
): Promise<void> => {
  console.debug('Deleting transaction:', transaction);
  await apiClient.delete(`${basePath(profileCode)}/${transaction.code}`);
};
