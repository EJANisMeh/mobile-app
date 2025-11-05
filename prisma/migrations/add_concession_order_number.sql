-- Migration: Add concession_order_number to orders table
-- Date: 2025-11-06
-- Description: Adds a new column to track order numbers per concession per day.
--              Order numbers start from 1 and increment for each concession.
--              They reset to 1 when a new working day starts.

-- Instructions for pgAdmin:
-- 1. Open pgAdmin and connect to your database
-- 2. Right-click on your database → Query Tool
-- 3. Copy and paste this entire SQL script
-- 4. Execute the script (F5 or click Execute button)
-- 5. Verify the changes by running the verification query at the bottom

-- Add the new column
ALTER TABLE orders
ADD COLUMN concession_order_number INTEGER;

-- Create index for faster lookups (concession + order number)
CREATE INDEX idx_orders_concession_order_number 
ON orders(concession_id, concession_order_number);

-- Verification query: Check the new column
SELECT 
    id,
    concession_id,
    concession_order_number,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 20;

-- Note: The concession_order_number will be NULL for now.
-- It will be automatically generated when new orders are created.
-- The backend will handle the logic to generate the correct number.
