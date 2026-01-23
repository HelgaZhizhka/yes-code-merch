# Locale & Region Configuration

Region-based formatting system for internationalization support.

## Quick Start

```typescript
import { localeConfig } from '@shared/config/locale';

localeConfig.locale; // 'en-GB'
localeConfig.region; // 'EU'
```

## Configuration

### Environment Variable

```bash
# .env
VITE_REGION=EU   # Options: EU, US
```

### Available Regions

| Region | Locale  | Price Format (EUR) |
| ------ | ------- | ------------------ |
| `EU`   | `en-GB` | €30.00             |
| `US`   | `en-US` | €30.00             |

## Files

| File                                | Purpose                   |
| ----------------------------------- | ------------------------- |
| `src/vite-env.d.ts`                 | TypeScript env types      |
| `src/shared/config/index.ts`        | Main config with `REGION` |
| `src/shared/config/locale.ts`       | Locale logic & types      |
| `src/shared/lib/price-formatter.ts` | Price formatting          |

## Usage Examples

### Price Formatting

```typescript
import { formatPrice } from '@shared/lib/price-formatter';

formatPrice(3000, 'EUR'); // €30.00
```

### Date Formatting

```typescript
import { localeConfig } from '@shared/config/locale';

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat(localeConfig.locale).format(date);

// EU: '21/01/2026'
// US: '1/21/2026'
```

### Number Formatting

```typescript
import { localeConfig } from '@shared/config/locale';

const formatNumber = (num: number): string =>
  new Intl.NumberFormat(localeConfig.locale).format(num);

// 1234567.89 → '1,234,567.89'
```

## Extending

### Add New Region

```typescript
// shared/config/locale.ts
export const Region = {
  EU: 'EU',
  US: 'US',
  UK: 'UK', // add
} as const;

const REGION_LOCALE_MAP: Record<RegionType, string> = {
  EU: 'en-GB',
  US: 'en-US',
  UK: 'en-GB', // add
};
```

### User-Selectable Region (Future)

When implementing user region selection:

1. Create Zustand store in `shared/config/model/locale-store.ts`
2. Replace static `localeConfig` with store hook
3. Add UI selector in `features/region-selector/`

## Notes

- Currency stored in DB (`product_variants.currency`), default `'EUR'`
- Locale affects **formatting only**, not currency conversion
- BCP 47 tags: https://www.w3.org/International/articles/language-tags/
