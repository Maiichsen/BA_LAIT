create table if not exists quizzes (
    quiz_id uuid primary key default gen_random_uuid(),
    course_page_id uuid not null references course_pages(course_page_id) on delete cascade,
    title text null,
    certification_requirement bool default false,
    passing_percentage int2 null,
    updated_at timestamptz not null default now()
);

alter table quizzes enable row level security;