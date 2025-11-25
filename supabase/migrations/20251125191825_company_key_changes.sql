alter table companies
    add column registration_key uuid null default gen_random_uuid();