ALTER TABLE dental_tools
  ADD COLUMN IF NOT EXISTS image_url text;

DROP POLICY IF EXISTS "anon_insert_dental_tools" ON dental_tools;
CREATE POLICY "anon_insert_dental_tools" ON dental_tools FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dental_tools" ON dental_tools;
CREATE POLICY "anon_update_dental_tools" ON dental_tools FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dental_tools" ON dental_tools;
CREATE POLICY "anon_delete_dental_tools" ON dental_tools FOR DELETE
  TO anon, authenticated
  USING (true);
