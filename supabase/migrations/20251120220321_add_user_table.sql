create table if not exists users (
    user_id uuid primary key default gen_random_uuid(),
    company_id uuid null references company(company_id) on delete cascade,
    password text not null,
    email text not null unique,
    first_name text null,
    last_name text null,
    is_admin bool not null default false,
    is_company_user bool not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table users enable row level security;