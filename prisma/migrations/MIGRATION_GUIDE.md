# Database Migration Guide - Adding Multiple Categories Support

## Prerequisites

- pgAdmin 4 installed and connected to your database
- Backup your database before proceeding (just in case!)

## Step-by-Step Instructions for pgAdmin

### 1. **Backup Your Database** (IMPORTANT!)

- Right-click on your database → Backup
- Choose a location and create a backup file
- This allows you to restore if anything goes wrong

### 2. **Open Query Tool**

- In pgAdmin, right-click on your database
- Select "Query Tool" from the menu

### 3. **Run the Migration Script**

- Open the file: `prisma/migrations/add_menu_item_category_links.sql`
- Copy the entire contents
- Paste it into the pgAdmin Query Tool
- Click the "Execute/Run" button (▶️ icon) or press F5

### 4. **Verify the Migration**

The script will show you:

- How many category links were created
- How many unique menu items were migrated
- How many unique categories are in use

Expected output at the end:

```
total_links | unique_menu_items | unique_categories
-----------+-------------------+------------------
     X     |        Y          |        Z
```

### 5. **Check the Results**

Run this query to see the new junction table data:

```sql
SELECT
    micl.id,
    mi.name AS menu_item_name,
    mic.name AS category_name,
    micl.created_at
FROM menu_item_category_links micl
JOIN menu_items mi ON micl.menu_item_id = mi.id
JOIN menu_item_categories mic ON micl.category_id = mic.id
ORDER BY mi.name;
```

### 6. **Update Prisma Client**

After the database migration is successful, update your Prisma client:

```powershell
npx prisma generate
```

## What the Migration Does

1. **Creates junction table** `menu_item_category_links` with:

   - `id` (primary key)
   - `menu_item_id` (foreign key to menu_items)
   - `category_id` (foreign key to menu_item_categories)
   - `created_at` (timestamp)
   - `updated_at` (timestamp with auto-update trigger)

2. **Migrates existing data**: All menu items that currently have a `category_id` will get an entry in the junction table

3. **Adds indexes**: For better query performance on both foreign keys

4. **Creates trigger**: Auto-updates `updated_at` field on any update

5. **Keeps backward compatibility**: The old `category_id` column in `menu_items` is preserved

## Troubleshooting

### If you get an error:

1. Read the error message carefully
2. Check if the table already exists: `SELECT * FROM menu_item_category_links LIMIT 1;`
3. If needed, use the rollback script: `prisma/migrations/rollback_menu_item_category_links.sql`
4. Restore from backup if necessary

### Common Issues:

- **"relation already exists"**: The table was already created. Check if it has the correct structure.
- **Foreign key violation**: Check that all `category_id` values in `menu_items` exist in `menu_item_categories`
- **Permission denied**: Make sure your database user has CREATE TABLE privileges

## After Migration

The app is now ready to support multiple categories per menu item!

- The UI already supports selecting multiple categories (checkbox modal)
- The backend needs to be updated to handle the `categoryIds` array
- Old menu items with single categories are preserved in the junction table

## Next Backend Updates Needed

You'll need to update these backend files:

1. `backend/menu/addItem.ts` - Handle categoryIds array
2. `backend/menu/editItem.ts` - Handle categoryIds array
3. `backend/menu/getItem.ts` - Include all categories in response
4. `backend/customer/getCafeteriasWithMenuItems.ts` - Include categories in menu items

## Rollback (If Needed)

If something goes wrong, run the rollback script:
`prisma/migrations/rollback_menu_item_category_links.sql`

This will:

- Remove the junction table
- Remove triggers and indexes
- Preserve the original `category_id` column data
