ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS cook_time_minutes INTEGER CHECK (cook_time_minutes > 0);
