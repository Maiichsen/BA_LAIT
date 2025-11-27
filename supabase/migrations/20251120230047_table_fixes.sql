alter table course_keys
    alter column course_id set not null;

alter table course_pages
    alter column course_id set not null;

alter table enrollments
    alter column user_id set not null;

alter table enrollments
    alter column course_id set not null;

alter table company
    rename to companies;

alter table course
    rename to courses;
