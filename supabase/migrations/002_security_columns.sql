-- Add security tracking columns to leads table
-- Run this migration after 001_leads.sql

-- Client IP address for abuse detection
alter table leads add column if not exists client_ip text;

-- Request fingerprint for duplicate detection
alter table leads add column if not exists fingerprint text;

-- Index for abuse detection queries
create index if not exists leads_client_ip on leads (client_ip);
create index if not exists leads_fingerprint on leads (fingerprint);

-- Index for finding recent submissions by IP (abuse prevention)
create index if not exists leads_ip_created on leads (client_ip, created_at desc);

comment on column leads.client_ip is 'Client IP address for abuse detection';
comment on column leads.fingerprint is 'Browser fingerprint hash for duplicate detection';
