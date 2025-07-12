import type { DataPage } from '~/types/page';

import type { Transaction, TransactionsStats } from '~/types/transaction';
import apiClient, { type PageFilters, toApiDate } from './client';

const basePath = (profileCode: string) =>
  `/profiles/${profileCode}/transactions`;

export const fetchTransactions = async (
  profileCode: string,
  pageFilters: PageFilters,
): Promise<DataPage<Transaction>> => {
  console.debug('Fetching transactions with filters:', pageFilters);
  return await apiClient.getPage<Transaction>(
    basePath(profileCode),
    pageFilters,
  );
};

export const fetchStats = async (
  profileCode: string,
  from: Date,
  to?: Date,
): Promise<TransactionsStats> => {
  const toDate = to ? new Date(to) : from;
  return await apiClient.getJson<TransactionsStats>(
    `${basePath(profileCode)}/stats`,
    { from: toApiDate(from), to: toApiDate(toDate) },
  );
};

export const addTransaction = async (
  profileCode: string,
  transaction: Transaction,
): Promise<Transaction> => {
  console.debug('Adding transaction:', transaction);
  return await apiClient.postJson<Transaction>(
    basePath(profileCode),
    transaction,
  );
};

export const updateTransaction = async (
  profileCode: string,
  transaction: Transaction,
): Promise<Transaction> => {
  console.debug('Updating transaction:', transaction);
  return await apiClient.putJson<Transaction>(
    `${basePath(profileCode)}/${transaction.code}`,
    transaction,
  );
};

export const deleteTransaction = async (
  profileCode: string,
  transaction: Transaction,
): Promise<void> => {
  console.debug('Deleting transaction:', transaction);
  await apiClient.delete(`${basePath(profileCode)}/${transaction.code}`);
};
