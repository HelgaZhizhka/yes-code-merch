---
name: Locale & region configuration
description: Region enum, locale mapping, price formatting — not multi-language (no i18n library)
type: reference
---

# Locale & Region Configuration

Region-based formatting for prices. **NOT multi-language** — no `react-i18next` or translation files.

---

## Configuration

### Environment Variable

```bash
# .env
VITE_REGION=EU   # Options: EU, US
```

Map to locale:

```typescript
// src/shared/config/locale.ts
export const Region = { EU: 'EU', US: 'US' } as const;

const REGION_LOCALE_MAP: Record<RegionType, string> = {
  EU: 'en-GB',
  US: 'en-US',
};
```

---

## Usage

### Get Current Locale

```typescript
import { localeConfig } from '@shared/config/locale';

localeConfig.locale;  // 'en-GB' (from VITE_REGION env)
localeConfig.region;  // 'EU'
```

### Format Price

```typescript
import { formatPrice } from '@shared/lib/price-formatter';

formatPrice(3000, 'EUR'); // €30.00
formatPrice(3000, 'USD'); // $30.00
```

---

## Future: If Multi-Language Needed

Add `react-i18next` + translation files + Zustand locale store. Current code is SSR-ready for this migration but NOT implemented.

---

## Notes

- Currency stored in database (`product_variants.currency`), default `'EUR'`
- Locale affects **formatting only**, not currency conversion
- BCP 47 locale tags: https://www.w3.org/International/articles/language-tags/
