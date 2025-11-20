create table if not exists course (
    course_id uuid primary key default gen_random_uuid(),
    estimated_time_minutes int4 null,
    title text not null,
    course_description text not null,
    cover_image_url text null,
    soft_deleted_at timestamptz null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);