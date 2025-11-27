alter table courses
    add column long_course_description text not null default 'missing description';

alter table courses
    rename column course_description to short_course_description;