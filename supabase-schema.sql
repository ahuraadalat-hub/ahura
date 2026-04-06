-- ============================================
-- Dating Profile Generator - Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sessions table: tracks each profile generation session
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  selfie_url text,
  status text default 'pending' check (status in ('pending', 'analyzing', 'generating', 'completed', 'failed')),
  platform text default 'both' check (platform in ('tinder', 'hinge', 'both')),
  gender text,
  style_preference text
);

-- Generated photos table: stores each generated photo and its prompt
create table public.generated_photos (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  prompt text not null,
  image_url text,
  scene_type text not null,
  status text default 'pending' check (status in ('pending', 'generating', 'completed', 'failed')),
  sort_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_generated_photos_session_id on public.generated_photos(session_id);
create index idx_sessions_status on public.sessions(status);

-- Enable Row Level Security (permissive for demo)
alter table public.sessions enable row level security;
alter table public.generated_photos enable row level security;

-- Policies (allow all for anonymous access - demo app)
create policy "Allow all on sessions" on public.sessions for all using (true) with check (true);
create policy "Allow all on generated_photos" on public.generated_photos for all using (true) with check (true);

-- ============================================
-- Storage Buckets
-- Run these in the Supabase SQL editor or create via Dashboard
-- ============================================

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('selfies', 'selfies', true);
insert into storage.buckets (id, name, public) values ('generated-photos', 'generated-photos', true);

-- Storage policies (allow public access for demo)
create policy "Allow public upload selfies" on storage.objects for insert with check (bucket_id = 'selfies');
create policy "Allow public read selfies" on storage.objects for select using (bucket_id = 'selfies');
create policy "Allow public upload generated-photos" on storage.objects for insert with check (bucket_id = 'generated-photos');
create policy "Allow public read generated-photos" on storage.objects for select using (bucket_id = 'generated-photos');
