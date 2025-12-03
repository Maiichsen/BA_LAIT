create table if not exists quiz_questions (
    quiz_question_id uuid primary key default gen_random_uuid(),
    quiz_id uuid not null references quizzes(quiz_id) on delete cascade,
    question_type_id uuid not null references question_types(question_type_id) on delete cascade,
    question text null,
    descriptive_text text null,
    passing_percentage int2 null,
    order_index int4 not null
);

alter table quiz_questions enable row level security;