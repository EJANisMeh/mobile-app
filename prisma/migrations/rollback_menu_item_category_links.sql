-- Rollback Migration: Remove menu_item_category_links table
-- Use this ONLY if you need to undo the migration

-- Step 1: Drop the trigger
DROP TRIGGER IF EXISTS trigger_update_menu_item_category_links_updated_at 
    ON menu_item_category_links;

-- Step 2: Drop the trigger function
DROP FUNCTION IF EXISTS update_menu_item_category_links_updated_at();

-- Step 3: Drop indexes
DROP INDEX IF EXISTS idx_menu_item_category_links_menu_item_id;
DROP INDEX IF EXISTS idx_menu_item_category_links_category_id;

-- Step 4: Drop the junction table
DROP TABLE IF EXISTS menu_item_category_links;

-- Step 5: Verify rollback
SELECT 
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename = 'menu_item_category_links';
-- Should return 0 rows

-- NOTE: The original category_id column in menu_items is preserved,
-- so existing data remains intact after rollback
