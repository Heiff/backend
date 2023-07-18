CREATE TABLE auth(
    id serial not null primary key,
    username varchar(64) not null,
    password text not null
);