CREATE TABLE comments
(
  _id serial NOT NULL,
  body character varying(4000),
  updatedate date,
  postfk integer,
  userfk integer,
  CONSTRAINT comments_pkey PRIMARY KEY (_id)
)

CREATE TABLE posts
(
  _id serial NOT NULL,
  title character varying(40),
  body character varying(2000),
  userfk integer,
  CONSTRAINT posts_pkey PRIMARY KEY (_id)
)

CREATE TABLE users
(
  _id serial NOT NULL,
  username character varying(40),
  email character varying(2000),
  CONSTRAINT users_pkey PRIMARY KEY (_id)
)

CREATE SEQUENCE comments__id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 6
  CACHE 1;

CREATE SEQUENCE posts__id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;

CREATE SEQUENCE users__id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 3
  CACHE 1;