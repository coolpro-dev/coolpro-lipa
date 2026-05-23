-- CoolPro leads table — run in Supabase SQL editor or via CLI

create type lead_status as enum (
  'new',
  'contacted',
  'quoted',
  'scheduled',
  'closed'
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  name text not null,
  mobile text not null,
  email text,
  address text not null,
  preferred_schedule text,
  notes text,

  room_length_m numeric,
  room_width_m numeric,
  ceiling_height_m numeric,
  room_type text,
  insulation text,
  sun_exposure text,
  window_count int,
  floor_level text,
  window_orientation text,
  existing_ac_unit text,
  calculation_inputs jsonb not null,
  calculation_result jsonb not null,

  source_page text not null default '/calculator',
  device_type text,
  user_agent text,
  status lead_status not null default 'new',

  photo_paths text[] default '{}',
  assigned_to uuid,
  tenant_id text default 'coolpro-lipa'
);

create index if not exists leads_status_created on leads (status, created_at desc);
create index if not exists leads_mobile on leads (mobile);

alter table leads enable row level security;

-- No public policies — inserts via service role API only
