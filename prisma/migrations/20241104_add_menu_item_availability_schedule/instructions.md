# Add `availability_schedule` column to `menu_items`

1. Open pgAdmin and connect to the SCaFOMA-UB database.
2. Select the database, open the **Query Tool**, and run the SQL below.
3. After execution, refresh the `menu_items` table columns to confirm the new field exists.
4. No further data updates are required. Existing rows will keep the default empty JSON `{}`.

```sql
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS availability_schedule JSONB NOT NULL DEFAULT '{}'::jsonb;
```
