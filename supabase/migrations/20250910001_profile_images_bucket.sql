-- Create profile-images bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Enable RLS (Row Level Security)
alter table storage.objects enable row level security;

-- Allow public read access to profile images
create policy "Public read access to profile images"
on storage.objectsadd role  for select
using (bucket_id = 'profile-images');

-- Allow authenticated users to upload to their own folder: {auth.uid()}/...
create policy "Users can upload their own profile images"
on storage.objects for insert
with check (
  bucket_id = 'profile-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update files in their own folder
create policy "Users can update their own profile images"
on storage.objects for update
using (
  bucket_id = 'profile-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
  and octet_length(content) < 5242880 -- 5MB file size limit
);

-- Allow users to delete their own files
create policy "Users can delete their own profile images"
on storage.objects for delete
using (
  bucket_id = 'profile-images'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
