alter table users
    drop column if exists password;

alter table users
    add constraint user_auth foreign key (user_id) references auth.users(id) on delete cascade;