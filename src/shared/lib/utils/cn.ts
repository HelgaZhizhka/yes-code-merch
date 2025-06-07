import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: Array<ClassValue>): string => {
  return twMerge(clsx(inputs));
};

export default cn;
