create table if not exists company
(
    company_id   uuid primary key     default gen_random_uuid(),
    company_name text        not null unique,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);