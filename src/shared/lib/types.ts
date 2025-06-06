import type { ROUTES } from '../config/routes';

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
