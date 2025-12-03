create table if not exists contents (
    content_id uuid primary key default gen_random_uuid(),
    course_page_id uuid not null references course_pages(course_page_id) on delete cascade,
    content_json jsonb not null
);

alter table contents enable row level security;