create table if not exists enrollments (
    enrollment_id uuid primary key default gen_random_uuid(),
    user_id uuid null references users(user_id) on delete cascade,
    course_id uuid null references course(course_id),
    completed_at timestamptz null,
    activation_at timestamptz not null default now()
);

alter table enrollments enable row level security;