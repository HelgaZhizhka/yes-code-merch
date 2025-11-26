# Product Discounts - Seed Data Documentation

## Overview

Migration file: `supabase/migrations/20251124133642_seed_product_discounts_percent.sql`

This migration seeds the database with test discount data for Phase 1 implementation (percentage discounts only).

## Test Discounts

### 1. T-Shirt Permanent Sale ✅ ACTIVE

**Category:** T-Shirt (`7ffd66c5-99c0-4f98-8b41-f2830acfd3b3`)

**Details:**

- Discount: 10%
- Type: Percentage (`percent`)
- Priority: 10
- Valid period: Permanent (no start/end dates)
- Status: Active (`is_active = true`)
- Applies to: All products in T-Shirt category (3 products)
  - Long Sleeve T-Shirt Is That Possible
  - T-Shirt I Did It (variant 1)
  - T-Shirt I Did It (variant 2)

**Expected behavior:**

- All T-shirt products should show 10% discount
- No expiration date displayed
- Always active

---

### 2. Shoppers New Year Sale ✅ ACTIVE

**Category:** Shoppers (`d46711d1-d8c3-4f84-a5a4-347fbaac8458`)

**Details:**

- Discount: 20%
- Type: Percentage (`percent`)
- Priority: 15 (higher than T-Shirt discount)
- Valid period: 2025-11-24 to 2025-12-31 23:59:59
- Status: Active (`is_active = true`)
- Applies to: All products in Shoppers category (6 products)
  - Shopper Bag Yeees Black
  - Shopper Bag Yeees Blue
  - Shopper Bag Yeees Green
  - Shopper Bag Yeees Orange
  - Shopper Bag Yeees Purple
  - (and 1 more)

**Expected behavior:**

- All Shopper Bag products should show 20% discount
- Should display "Valid until Dec 31, 2025" or similar
- Will automatically become inactive after 2025-12-31

---

### 3. Inactive Test Discount ❌ INACTIVE

**Category:** T-Shirt (1 product only)

**Details:**

- Discount: 15%
- Type: Percentage (`percent`)
- Priority: 20 (highest priority, but inactive)
- Valid period: Permanent
- Status: Inactive (`is_active = false`)
- Applies to: One T-shirt product

**Expected behavior:**

- Should NOT be applied (filtered out by `getActiveDiscounts()`)
- Used to test `is_active` filtering logic
- Even though it has the highest priority, it should not appear

---

## Testing Checklist

### Frontend Display Tests

- [ ] T-Shirt products show 10% discount badge
- [ ] T-Shirt products show correct discounted price
- [ ] Shopper Bag products show 20% discount badge
- [ ] Shopper Bag products show correct discounted price
- [ ] Shopper Bag products show "Valid until" date
- [ ] Inactive discount does NOT appear anywhere

## Database Stats

**Expected records after migration:**

- T-Shirt discounts: 3 records (one per product)
- Shopper discounts: 6 records (one per product)
- Inactive discounts: 1 record
- **Total: 10 discount records**

## SQL Query to Verify

```sql
-- Check all created discounts
SELECT
  pd.name,
  pd.discount_value,
  pd.is_active,
  pd.valid_from,
  pd.valid_to,
  p.name as product_name,
  c.name as category_name
FROM product_discounts pd
JOIN products p ON p.id = pd.product_id
JOIN product_categories pc ON pc.product_id = p.id
JOIN categories c ON c.id = pc.category_id
ORDER BY pd.name, p.name;
```
