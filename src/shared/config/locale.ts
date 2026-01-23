import { config } from './index';

export const Region = {
  EU: 'EU',
  US: 'US',
} as const;

export type RegionType = (typeof Region)[keyof typeof Region];

export interface LocaleConfig {
  locale: string;
  region: RegionType;
}

const REGION_LOCALE_MAP: Record<RegionType, string> = {
  EU: 'en-GB',
  US: 'en-US',
};

const DEFAULT_REGION: RegionType = Region.EU;

export const getLocaleConfig = (): LocaleConfig => {
  const region = config.REGION as RegionType | undefined;
  const normalizedRegion =
    region && REGION_LOCALE_MAP[region] ? region : DEFAULT_REGION;

  return {
    locale: REGION_LOCALE_MAP[normalizedRegion],
    region: normalizedRegion,
  };
};

export const localeConfig = getLocaleConfig();
