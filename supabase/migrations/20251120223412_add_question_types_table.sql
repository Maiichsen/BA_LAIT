create table if not exists question_types (
    question_type_id uuid primary key default gen_random_uuid(),
    title text null,
    description text not null
);

alter table question_types enable row level security;