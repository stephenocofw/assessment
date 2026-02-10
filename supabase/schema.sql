-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables if re-running (optional, be careful in prod)
drop table if exists investigations;
drop table if exists incidents;
drop table if exists work_types;
drop table if exists worksites;

-- Work Types Reference Table
create table work_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Worksites Reference Table
create table worksites (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Incidents Table
create table incidents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  what_happened text,
  cause text,
  prevention text,
  initial_actions text,
  medical_treatment boolean default false,
  potential_sif boolean default false,
  potential_sif_why text,
  needs_investigation boolean default false,
  status text check (status in ('Triage', 'Investigating', 'Closed')) default 'Triage',
  work_type_id uuid references work_types(id),
  worksite_id uuid references worksites(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Investigations Table
create table investigations (
  id uuid primary key default uuid_generate_v4(),
  incident_id uuid references incidents(id) on delete cascade not null,
  assessments jsonb default '[]'::jsonb, -- Storing factor assessments as JSON
  timeline jsonb default '[]'::jsonb,    -- Storing timeline events as JSON
  summary text,
  status text check (status in ('Draft', 'Submitted')) default 'Draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table incidents enable row level security;
alter table investigations enable row level security;
alter table work_types enable row level security;
alter table worksites enable row level security;

-- Create Policies (Public access for demo purposes, lock down in production)
create policy "Allow public read access" on incidents for select using (true);
create policy "Allow public insert access" on incidents for insert with check (true);
create policy "Allow public update access" on incidents for update using (true);

create policy "Allow public read access" on investigations for select using (true);
create policy "Allow public insert access" on investigations for insert with check (true);
create policy "Allow public update access" on investigations for update using (true);

create policy "Allow public read access" on work_types for select using (true);
create policy "Allow public insert access" on work_types for insert with check (true);

create policy "Allow public read access" on worksites for select using (true);
create policy "Allow public insert access" on worksites for insert with check (true);

-- Insert Seed Data (Optional - remove if not needed)
insert into work_types (name) values ('Maintenance'), ('Construction'), ('Drilling'), ('Logistics'), ('Processing');
insert into worksites (name) values ('Site A - Pilbara'), ('Site B - Perth'), ('Site C - Goldfields'), ('Site D - Port');
