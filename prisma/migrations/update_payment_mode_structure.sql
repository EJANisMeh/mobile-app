-- Migration: Add needsProof and proofMode to payment_mode in existing orders
-- Date: 2025-11-06
-- Description: Updates the payment_mode structure in existing orders to include 
--              needsProof and proofMode fields. This ensures consistency with the 
--              new PaymentMode interface.

-- Instructions for pgAdmin:
-- 1. Open pgAdmin and connect to your database
-- 2. Right-click on your database → Query Tool
-- 3. Copy and paste this entire SQL script
-- 4. Execute the script (F5 or click Execute button)
-- 5. Verify the changes by running the verification query at the bottom

-- Update orders with Cash payment method
-- Cash doesn't require proof, so needsProof = false, proofMode = null
UPDATE orders
SET payment_mode = jsonb_set(
    jsonb_set(
        payment_mode::jsonb,
        '{needsProof}',
        'false'::jsonb
    ),
    '{proofMode}',
    'null'::jsonb
)
WHERE payment_mode::jsonb ->> 'type' ILIKE '%cash%'
  AND NOT (payment_mode::jsonb ? 'needsProof');

-- Update orders with GCash payment method
-- GCash requires screenshot proof
UPDATE orders
SET payment_mode = jsonb_set(
    jsonb_set(
        payment_mode::jsonb,
        '{needsProof}',
        'true'::jsonb
    ),
    '{proofMode}',
    '"screenshot"'::jsonb
)
WHERE payment_mode::jsonb ->> 'type' ILIKE '%gcash%'
  AND NOT (payment_mode::jsonb ? 'needsProof');

-- Update orders with Bank Transfer payment method
-- Bank Transfer can use text (reference number) as proof
UPDATE orders
SET payment_mode = jsonb_set(
    jsonb_set(
        payment_mode::jsonb,
        '{needsProof}',
        'true'::jsonb
    ),
    '{proofMode}',
    '"text"'::jsonb
)
WHERE (payment_mode::jsonb ->> 'type' ILIKE '%bank%' 
   OR payment_mode::jsonb ->> 'type' ILIKE '%transfer%')
  AND NOT (payment_mode::jsonb ? 'needsProof');

-- For any other payment methods, default to requiring screenshot proof
-- You may need to adjust this based on your actual payment methods
UPDATE orders
SET payment_mode = jsonb_set(
    jsonb_set(
        payment_mode::jsonb,
        '{needsProof}',
        'true'::jsonb
    ),
    '{proofMode}',
    '"screenshot"'::jsonb
)
WHERE payment_mode IS NOT NULL
  AND payment_mode::text != '{}'
  AND NOT (payment_mode::jsonb ? 'needsProof');

-- Verification query: Check updated payment_mode structures
-- Run this after executing the updates to verify the changes
SELECT 
    id,
    payment_mode::jsonb ->> 'type' as payment_type,
    payment_mode::jsonb ->> 'details' as payment_details,
    payment_mode::jsonb ->> 'needsProof' as needs_proof,
    payment_mode::jsonb ->> 'proofMode' as proof_mode,
    payment_proof,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 20;

-- Expected results:
-- - Cash orders: needsProof = false, proofMode = null
-- - GCash orders: needsProof = true, proofMode = "screenshot"
-- - Bank Transfer orders: needsProof = true, proofMode = "text"
-- - Other payment methods: needsProof = true, proofMode = "screenshot"
