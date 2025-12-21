import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { config } from '../config';

const STORAGE_PATH = '/storage/v1/object/public';

export const cn = (...inputs: Array<ClassValue>): string => {
  return twMerge(clsx(inputs));
};

export const isNotNull = <T>(value: T): value is NonNullable<T> => {
  return value != null;
};

export const getStorageUrl = (path: string): string => {
  if (!path) return '';

  const { SUPABASE_URL } = config;
  return `${SUPABASE_URL}${STORAGE_PATH}/${path}`;
};
