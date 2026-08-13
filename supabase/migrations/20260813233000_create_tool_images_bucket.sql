INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tool-images',
  'tool-images',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_tool_images" ON storage.objects;
CREATE POLICY "public_read_tool_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'tool-images');

DROP POLICY IF EXISTS "public_insert_tool_images" ON storage.objects;
CREATE POLICY "public_insert_tool_images" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'tool-images');

DROP POLICY IF EXISTS "public_update_tool_images" ON storage.objects;
CREATE POLICY "public_update_tool_images" ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'tool-images')
  WITH CHECK (bucket_id = 'tool-images');

DROP POLICY IF EXISTS "public_delete_tool_images" ON storage.objects;
CREATE POLICY "public_delete_tool_images" ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'tool-images');
