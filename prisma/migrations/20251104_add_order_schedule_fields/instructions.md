````markdown
# Add scheduling fields to `orders`

1. Open pgAdmin and connect to the SCaFOMA-UB database.
2. Launch the **Query Tool** for the target database.
3. Execute the SQL below to add the new columns.
4. Refresh the `orders` table to confirm the columns are present.
5. No data backfill is required because existing rows will default to `order_mode = 'now'` with a `NULL` scheduled timestamp.

```sql
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS order_mode VARCHAR(20) NOT NULL DEFAULT 'now',
    ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ NULL;
```

6. If you previously added the columns manually, you can skip rerunning this script.
````
