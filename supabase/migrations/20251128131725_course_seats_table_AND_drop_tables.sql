create table if not exists course_seats (
    course_seat_id uuid primary key default gen_random_uuid(),
    company_id uuid not null references  companies(company_id) on delete cascade,
    course_id uuid not null references  courses(course_id) on delete cascade,
    user_id uuid null references  users(user_id) on delete cascade,
    reserved_for_email text null,
    completed_at timestamptz null,
    created_at timestamptz not null default now(),
    activation_at timestamptz null
);

drop table if exists course_keys;
drop table if exists enrollments;