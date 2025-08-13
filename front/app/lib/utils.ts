import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string.
 * @param value - The numeric value to format.
 * @param language - The locale to use for formatting.
 * @returns The formatted currency string.
 */
export const formatMoney = (value: number, language?: string): string => {
  return new Intl.NumberFormat(language ?? 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

/**
 * Formats a number as a decimal string.
 * @param value - The numeric value to format.
 * @param digits - The number of decimal places to include.
 * @param language - The locale to use for formatting.
 * @returns The formatted decimal string.
 */
export const formatNumber = (
  value: number,
  digits: number,
  language?: string,
): string => {
  return new Intl.NumberFormat(language ?? 'en-US', {
    style: 'decimal',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

/**
 * Formats a date to a human-readable string.
 * @param date - The date to format.
 * @param language - The locale to use for formatting.
 * @returns The formatted date string.
 */
export const formatDateTime = (date?: Date | string, language?: string): string => {
  if (!date) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const datetime = new Date(date);
  return datetime.toLocaleDateString(language ?? 'en-US', options);
};

/**
 * Formats a date to a human-readable string.
 * @param date - The date to format.
 * @param language - The locale to use for formatting.
 * @returns The formatted date string.
 */
export const formatDate = (date?: Date | string, language?: string): string => {
  if (!date) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const datetime = new Date(date);
  return datetime.toLocaleDateString(language ?? 'en-US', options);
};

/**
 * Returns the first day of the current month.
 * @returns The date corresponding to the first day of the current month.
 */
export const firstDateOfMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

/**
 * Obtains css class names for monetary values.
 * @param value - The monetary value to evaluate.
 * @returns The css class name corresponding to the monetary value.
 */
export const moneyClassName = (value: number): string => {
  if (value > 0) {
    return 'text-income';
  }
  if (value < 0) {
    return 'text-expense';
  }
  return 'text-foreground';
};
