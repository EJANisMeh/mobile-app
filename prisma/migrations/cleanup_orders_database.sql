-- ============================================================
-- CLEANUP ORDERS DATABASE
-- ============================================================
-- Purpose: Delete all test orders and order items, reset sequences
-- Date: 2025-11-12
-- Warning: This will DELETE ALL orders and order items!
-- ============================================================

-- Instructions:
-- 1. Open pgAdmin
-- 2. Connect to your database
-- 3. Right-click on your database > Query Tool
-- 4. Copy and paste this entire script
-- 5. Review the script carefully
-- 6. Execute (F5) to run

-- ============================================================
-- STEP 1: Delete all order items first (foreign key constraint)
-- ============================================================
DELETE FROM order_items;

-- ============================================================
-- STEP 2: Delete all notifications related to orders
-- ============================================================
DELETE FROM notifications WHERE order_id IS NOT NULL;

-- ============================================================
-- STEP 3: Delete all orders
-- ============================================================
DELETE FROM orders;

-- ============================================================
-- STEP 4: Reset the order_items sequence to start from 1
-- ============================================================
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- ============================================================
-- STEP 5: Reset the orders sequence to start from 1
-- ============================================================
ALTER SEQUENCE orders_id_seq RESTART WITH 1;

-- ============================================================
-- STEP 6: Reset the notifications sequence to start from 1
-- ============================================================
ALTER SEQUENCE notifications_id_seq RESTART WITH 1;

-- ============================================================
-- VERIFICATION QUERIES (Run these to verify the cleanup)
-- ============================================================

-- Check if orders table is empty (should return 0)
SELECT COUNT(*) as orders_count FROM orders;

-- Check if order_items table is empty (should return 0)
SELECT COUNT(*) as order_items_count FROM order_items;

-- Check if order-related notifications are deleted
SELECT COUNT(*) as order_notifications_count FROM notifications WHERE order_id IS NOT NULL;

-- Check sequence values (should all be at 1)
SELECT 
    'orders' as table_name, 
    last_value as next_id 
FROM orders_id_seq
UNION ALL
SELECT 
    'order_items' as table_name, 
    last_value as next_id 
FROM order_items_id_seq
UNION ALL
SELECT 
    'notifications' as table_name, 
    last_value as next_id 
FROM notifications_id_seq;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If all verification queries return 0 for counts and 1 for next_id,
-- then the cleanup was successful!
-- ============================================================
