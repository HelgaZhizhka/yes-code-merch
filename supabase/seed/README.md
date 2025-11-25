# Seed Data

This directory contains seed data scripts for development and testing purposes.

## ⚠️ Important

**Seed files are NOT applied automatically!** They must be run manually when needed.

Unlike migrations in `supabase/migrations/`, seed data:
- ❌ Does NOT run on `supabase db push`
- ❌ Does NOT run on production deployments
- ✅ Runs only when you explicitly execute them

## 📁 Available Seed Files

### `product_images.sql`
Seeds product images for 3 products that have uploaded photos in Supabase Storage.

**Products:**
- Badge Wow That Is Cool White (bdg-10-white-master)
- Hoodie Take a Junior White (hd-9-white-6980f3-master)
- T-Shirt I Did It Blue (t-1-blue-7703ff-master)

**Creates:** 9 records (3 products × 3 image sizes)

### `product_discounts.sql`
Seeds test discount data for Phase 1 implementation (percentage discounts only).

**Discounts:**
1. T-Shirt Permanent Sale - 10% (permanent, all T-Shirt products)
2. Shoppers New Year Sale - 20% (until 2025-12-31, all Shopper products)
3. Inactive Test Discount - 15% (inactive, for testing)

**Creates:** ~10 records (3 T-Shirts + 6 Shoppers + 1 inactive)

## 🚀 How to Apply Seed Data

### Option 1: Apply all seeds at once
```bash
# Run all seed files
supabase db seed
```

### Option 2: Apply specific seed file
```bash
# Navigate to project root
cd /path/to/yes-code-merch

# Apply specific seed
psql "$DATABASE_URL" < supabase/seed/product_images.sql
# or
psql "$DATABASE_URL" < supabase/seed/product_discounts.sql
```

### Option 3: Using Supabase CLI with local database
```bash
# Reset local database and apply seeds
supabase db reset

# Or apply seed to specific database
supabase db seed --db-url "postgresql://..."
```

### Option 4: Manual execution via Supabase Dashboard
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of seed file
4. Execute

## 🔄 Re-running Seeds

All seed files are **idempotent** - they can be safely run multiple times.

They use `ON CONFLICT DO UPDATE` clauses to:
- Insert new records if they don't exist
- Update existing records if they do exist

## 📝 Best Practices

1. **Local Development:**
   - Run seeds after `supabase db reset`
   - Run seeds when setting up new dev environment
   - Re-run seeds when you need fresh test data

2. **Staging/Production:**
   - ⚠️ Be careful! Only run seeds on clean databases
   - Never run seeds on production without approval
   - Consider creating separate seed files for different environments

3. **Testing:**
   - Run seeds before running E2E tests
   - Reset and re-seed between test runs for consistency

## 🗂️ Relationship with Migrations

```
supabase/
├── migrations/          ← Schema changes (CREATE, ALTER, DROP)
│   ├── 20250101_create_products.sql
│   └── 20250102_add_discounts.sql
│
└── seed/               ← Test data (INSERT, UPDATE)
    ├── product_images.sql
    └── product_discounts.sql
```

**Migrations** = Structure (tables, columns, constraints)
**Seeds** = Data (test records, initial values)

## ❓ FAQ

**Q: Why aren't seeds in migrations folder?**
A: Seeds contain test data that should only be applied manually in development. Migrations are for schema changes that run automatically on all environments.

**Q: Can I modify existing seed files?**
A: Yes! Seed files are idempotent, so you can safely update them and re-run.

**Q: Should I commit seed files?**
A: Yes, commit them so other developers can use the same test data.

**Q: What if I need different seed data for staging vs production?**
A: Create separate seed files: `product_images.staging.sql` and `product_images.prod.sql`
