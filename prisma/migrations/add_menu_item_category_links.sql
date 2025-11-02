-- Migration: Add support for multiple categories per menu item
-- This creates a junction table to support many-to-many relationship
-- between menu items and categories

-- Step 1: Create the junction table
CREATE TABLE IF NOT EXISTS menu_item_category_links (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_menu_item_category_links_menu_item 
        FOREIGN KEY (menu_item_id) 
        REFERENCES menu_items(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION,
    
    CONSTRAINT fk_menu_item_category_links_category 
        FOREIGN KEY (category_id) 
        REFERENCES menu_item_categories(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION,
    
    -- Unique constraint to prevent duplicate entries
    CONSTRAINT unique_menu_item_category 
        UNIQUE (menu_item_id, category_id)
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_item_category_links_menu_item_id 
    ON menu_item_category_links(menu_item_id);

CREATE INDEX IF NOT EXISTS idx_menu_item_category_links_category_id 
    ON menu_item_category_links(category_id);

-- Step 3: Migrate existing data from menu_items.category_id to junction table
-- This preserves existing single-category assignments
INSERT INTO menu_item_category_links (menu_item_id, category_id, created_at, updated_at)
SELECT 
    id AS menu_item_id,
    category_id,
    NOW() AS created_at,
    NOW() AS updated_at
FROM menu_items
WHERE category_id IS NOT NULL
ON CONFLICT (menu_item_id, category_id) DO NOTHING;

-- Step 4: Create trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_menu_item_category_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS trigger_update_menu_item_category_links_updated_at 
    ON menu_item_category_links;

CREATE TRIGGER trigger_update_menu_item_category_links_updated_at
    BEFORE UPDATE ON menu_item_category_links
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_item_category_links_updated_at();

-- Step 6: Verify migration
-- Check how many records were migrated
SELECT 
    COUNT(*) as total_links,
    COUNT(DISTINCT menu_item_id) as unique_menu_items,
    COUNT(DISTINCT category_id) as unique_categories
FROM menu_item_category_links;

-- NOTE: The existing category_id column in menu_items table is kept for backward compatibility
-- It can be removed later after confirming everything works with the new junction table
-- To remove it later, run: ALTER TABLE menu_items DROP COLUMN category_id;
