create table if not exists invited_users (
    invited_user_id uuid primary key default gen_random_uuid(),
    company_id uuid not null references companies(company_id) on delete cascade,
    is_company_user bool not null default false
);