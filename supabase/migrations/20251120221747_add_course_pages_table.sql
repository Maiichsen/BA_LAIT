create table if not exists course_pages (
    course_page_id uuid primary key default gen_random_uuid(),
    course_id uuid null references course(course_id) on delete cascade,
    is_required bool default false,
    order_index int4 not null,
    updated_at timestamptz not null default now()
);

alter table course_pages enable row level security;