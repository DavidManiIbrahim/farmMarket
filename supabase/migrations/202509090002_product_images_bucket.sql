-- Create public product-images bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Create policy to allow public to read product images
create policy "Public read access for product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Allow authenticated users to upload files to their own folder
create policy "Users can upload product images to their own folder"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
  and octet_length(content) < 5242880 -- 5MB file size limit
);

-- Allow users to update their own files
create policy "Users can update their own product images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
  and octet_length(content) < 5242880 -- 5MB file size limit
);

-- Allow users to delete their own files
create policy "Users can delete their own product images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
