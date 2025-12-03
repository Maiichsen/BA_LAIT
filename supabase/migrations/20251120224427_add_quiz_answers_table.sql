create table if not exists quiz_answers (
    quiz_answer_id uuid primary key default gen_random_uuid(),
    quiz_question_id uuid not null references quiz_questions(quiz_question_id) on delete cascade,
    answer_option text null,
    right_option bool not null
);

alter table quiz_answers enable row level security;