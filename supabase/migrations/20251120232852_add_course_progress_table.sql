create table if not exists course_progress (
    course_progress_id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(user_id) on delete cascade,
    course_page_id uuid not null references course_pages(course_page_id) on delete cascade
);

alter table course_progress enable row level security;