-- Manual Migration: Fix empty payment_mode for existing orders
-- Date: 2025-11-06
-- Description: Update orders with empty payment_mode to have default Cash payment

-- Instructions:
-- 1. Open pgAdmin
-- 2. Navigate to your database
-- 3. Open Query Tool (Tools > Query Tool)
-- 4. Copy and paste the SQL below
-- 5. Review the UPDATE statement carefully
-- 6. Execute the query
-- 7. Verify the changes by running the SELECT statement at the end

-- Update orders with empty payment_mode JSON to Cash
UPDATE orders
SET payment_mode = jsonb_build_object(
    'type', 'Cash',
    'details', 'Pay with cash upon pickup'
)
WHERE payment_mode = '{}'::jsonb
   OR payment_mode IS NULL;

-- Verify the changes
SELECT 
    id,
    customer_id,
    concession_id,
    total,
    payment_mode,
    created_at
FROM orders
ORDER BY id;

-- Expected result: All orders should have payment_mode with 'type' and 'details' fields
