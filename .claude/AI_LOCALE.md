# Locale & Region Configuration

This document describes the locale and region configuration system for internationalization support.

---

## Overview

The locale system provides region-based formatting for:

- Currency (prices)
- Dates (future)
- Numbers (future)

Currently, the system uses environment variables with a path to user-selectable regions.

---

## File Structure

```
src/shared/config/
├── index.ts        # Main config with REGION from env
└── locale.ts       # Locale configuration and types
```

---

## Configuration

### Environment Variable

```bash
# .env
VITE_REGION=EU   # Options: EU, US
```

### Type Definitions

```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_HOST: string;
  readonly VITE_REGION: string;
}
```

---

## Current Implementation

### Region Types

```typescript
// shared/config/locale.ts
export const Region = {
  EU: 'EU',
  US: 'US',
} as const;

export type RegionType = (typeof Region)[keyof typeof Region];
```

### Locale Config Interface

```typescript
export interface LocaleConfig {
  locale: string; // BCP 47 locale tag (e.g., 'en-GB')
  region: RegionType;
}
```

### Region to Locale Mapping

| Region | Locale  | Format Example (EUR) |
| ------ | ------- | -------------------- |
| `EU`   | `en-GB` | €30.00               |
| `US`   | `en-US` | €30.00               |

---

## Usage

### Basic Usage

```typescript
import { localeConfig } from '@shared/config/locale';

// Access current locale
localeConfig.locale; // 'en-GB'
localeConfig.region; // 'EU'
```

### Price Formatting

```typescript
import { formatPrice } from '@shared/lib/price-formatter';

formatPrice(3000, 'EUR'); // €30.00
formatPrice(3000, 'USD'); // $30.00
```

### Date Formatting (Example)

```typescript
import { localeConfig } from '@shared/config/locale';

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(localeConfig.locale).format(date);
};

formatDate(new Date()); // '21/01/2026' (en-GB) or '1/21/2026' (en-US)
```

### Number Formatting (Example)

```typescript
import { localeConfig } from '@shared/config/locale';

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat(localeConfig.locale).format(num);
};

formatNumber(1234567.89); // '1,234,567.89'
```

---

## Extending the System

### Adding New Regions

```typescript
// shared/config/locale.ts
export const Region = {
  EU: 'EU',
  US: 'US',
  UK: 'UK', // new
  CA: 'CA', // new
} as const;

const REGION_LOCALE_MAP: Record<RegionType, string> = {
  EU: 'en-GB',
  US: 'en-US',
  UK: 'en-GB',
  CA: 'en-CA',
};
```

### Adding Language Support

```typescript
// Extended LocaleConfig for multi-language
export interface LocaleConfig {
  locale: string;
  region: RegionType;
  language: string;
  dateFormat: string;
}

const REGION_CONFIG_MAP: Record<RegionType, LocaleConfig> = {
  EU: {
    locale: 'en-GB',
    region: 'EU',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
  },
  US: {
    locale: 'en-US',
    region: 'US',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  },
};
```

### User-Selectable Region (Zustand Store)

```typescript
// shared/config/model/locale-store.ts
import { createAppStore } from '@shared/lib/create-app-store';
import { type RegionType, Region, getLocaleConfig } from '../locale';

interface LocaleState {
  region: RegionType;
  locale: string;
  setRegion: (region: RegionType) => void;
}

export const useLocaleStore = createAppStore<LocaleState>(
  'locale-store',
  (set) => ({
    region: getLocaleConfig().region,
    locale: getLocaleConfig().locale,
    setRegion: (region) =>
      set((state) => {
        const config = getLocaleConfigForRegion(region);
        state.region = region;
        state.locale = config.locale;
      }),
  })
);
```

### UI Component for Region Selection

```typescript
// features/region-selector/ui/RegionSelector.tsx
import { Region, type RegionType } from '@shared/config/locale';
import { useLocaleStore } from '@shared/config/model/locale-store';

export const RegionSelector = () => {
  const { region, setRegion } = useLocaleStore();

  return (
    <select
      value={region}
      onChange={(e) => setRegion(e.target.value as RegionType)}
    >
      {Object.values(Region).map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );
};
```

---

## Notes

- Currency is stored in database (`product_variants.currency`), default is `'EUR'`
- Locale only affects **formatting**, not currency conversion
- For multi-currency support, backend changes would be needed
- BCP 47 locale tags: https://www.w3.org/International/articles/language-tags/
