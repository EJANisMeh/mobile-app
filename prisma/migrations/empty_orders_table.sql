-- Migration: Empty orders table for fresh start
-- Date: 2025-11-06
-- Description: Deletes all orders and order items for a clean slate.
--              USE WITH CAUTION - This will delete ALL order data!

-- Instructions for pgAdmin:
-- 1. Open pgAdmin and connect to your database
-- 2. Right-click on your database → Query Tool
-- 3. Copy and paste this entire SQL script
-- 4. Execute the script (F5 or click Execute button)
-- 5. Verify the changes by running the verification query at the bottom

-- WARNING: This will delete ALL orders and their items!
-- Make sure you have a backup if needed!

-- Delete all order items first (due to foreign key constraint)
DELETE FROM order_items;

-- Delete all orders
DELETE FROM orders;

-- Reset the sequences to start from 1 again
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Verification query: Check that tables are empty
SELECT COUNT(*) as order_count FROM orders;
SELECT COUNT(*) as order_items_count FROM order_items;

-- Expected results: Both counts should be 0
