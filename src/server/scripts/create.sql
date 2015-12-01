CREATE TABLE comments
(
  _id serial NOT NULL,
  body character varying(4000),
  updatedate date,
  postfk integer,
  userfk integer,
  CONSTRAINT comments_pkey PRIMARY KEY (_id)
);

ALTER SEQUENCE comments__id_seq RESTART WITH 10;

CREATE TABLE posts
(
  _id serial NOT NULL,
  title character varying(40),
  body character varying(2000),
  userfk integer,
  CONSTRAINT posts_pkey PRIMARY KEY (_id)
);

ALTER SEQUENCE posts__id_seq RESTART WITH 10;

CREATE TABLE users
(
  _id serial NOT NULL,
  username character varying(40),
  email character varying(2000),
  CONSTRAINT users_pkey PRIMARY KEY (_id)
);

ALTER SEQUENCE users__id_seq RESTART WITH 10;



