CREATE TABLE auth(
    id serial not null primary key,
    username varchar(64) not null,
    password text not null
);

CREATE TABLE card(
    id serial not null primary key,
    name varchar(64) not null,
    number bigint not null,
    balance integer not null,
    user_id integer not null
);

CREATE TABLE channel(
    id serial not null primary key,
    name varchar(64) not null,
    month integer not null,
    year integer not null,
    descr text not null,
    card_id integer not null,
    author_id integer not null
);
CREATE TABLE subscribe(
    id serial not null primary key,
    name varchar(32) not null unique,
    price integer not null,
    year integer not null,
    month integer not null,
    day integer not null,
    channel_id integer not null,
    user_id integer not null
);

