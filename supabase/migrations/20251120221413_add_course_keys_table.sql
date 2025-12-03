create table if not exists course_keys (
    course_key_id uuid primary key default gen_random_uuid(),
    company_id uuid null references company(company_id) on delete cascade,
    course_id uuid null references course(course_id) on delete cascade,
    expiration_at timestamptz,
    created_at timestamptz not null default now()
);

alter table course_keys enable row level security;