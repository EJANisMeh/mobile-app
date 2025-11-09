# Migration Instructions

## Overview
This migration adds support for multi-category mode and price adjustments in variation groups.

## Database Changes
1. **category_filter_ids** - New integer array column to store multiple category IDs for multi-category mode
2. **category_price_adjustment** - New decimal column to store price adjustments (positive or negative)

## Steps to Apply in pgAdmin

1. Open pgAdmin and connect to your database
2. Navigate to your database → Schemas → public → Tables → menu_item_variation_groups
3. Right-click on the database name and select "Query Tool"
4. Copy the SQL from `add_multi_category_and_price_adjustment.sql` file
5. Paste it into the query editor
6. Click the "Execute" button (▶) or press F5
7. Verify the output shows both columns were added successfully

## Verification
After running the migration, the verification query at the end will show:
```
column_name                  | data_type     | is_nullable
-----------------------------|---------------|------------
category_filter_ids          | ARRAY         | YES
category_price_adjustment    | numeric       | YES
```

## Rollback (if needed)
If you need to revert these changes, run:
```sql
ALTER TABLE menu_item_variation_groups
DROP COLUMN category_filter_ids;

ALTER TABLE menu_item_variation_groups
DROP COLUMN category_price_adjustment;

DROP INDEX IF EXISTS idx_menu_item_variation_groups_category_filter_ids;
```

## Update Prisma Schema
After successfully applying the migration in pgAdmin, update your `prisma/schema.prisma` file:

Add these two lines to the `menu_item_variation_groups` model (after `category_filter_id`):
```prisma
category_filter_ids            Int[]?
category_price_adjustment      Decimal?                             @db.Decimal(10, 2)
```

Then run:
```
npx prisma generate
```

This will regenerate the Prisma client with the new columns.
