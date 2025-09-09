-- Create public avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policies for storage.objects in avatars bucket
-- Enable RLS (usually enabled by default for storage.objects)
alter table storage.objects enable row level security;

-- Allow anyone to read files from the public avatars bucket
create policy "Public read access to avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- Allow authenticated users to upload to their own folder: {auth.uid()}/...
create policy "Authenticated users can upload their own avatar files"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update files in their own folder
create policy "Authenticated users can update their own avatar files"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete files in their own folder
create policy "Authenticated users can delete their own avatar files"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);


