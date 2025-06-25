import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMoney = (value: number, language?: string) => {
  return new Intl.NumberFormat(language ?? 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatNumber = (
  value: number,
  digits: number,
  language?: string,
) => {
  return new Intl.NumberFormat(language ?? 'en-US', {
    style: 'decimal',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

export const formatDateTime = (date?: Date | string, language?: string) => {
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

export const formatDate = (date?: Date | string, language?: string) => {
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

export const moneyClassName = (value: number, prefix = 'text') => {
  if (value > 0) {
    return `${prefix}-green-300`;
  }
  if (value < 0) {
    return `${prefix}-orange-300`;
  }
  return `${prefix}-foreground`;
};
