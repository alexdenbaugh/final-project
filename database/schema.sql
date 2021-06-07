set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "posts" (
  "postId"         serial,
  "lenderName"     text           not null,
  "lenderId"       integer        not null,
  "gameName"       text           not null,
  "gameId"         integer        not null,
  "thumbnail"      text           not null,
  "image"          text           not null,
  "lenderComments" text           not null,
  "description"    text           not null,
  "minPlayers"     integer        not null,
  "maxPlayers"     integer        not null,
  "minPlayTime"    integer        not null,
  "maxPlayTime"    integer        not null,
  "ageLimit"       integer        not null,
  "yearPublished"  integer        not null,
  "createdAt"      timestamptz(6) not null default now(),
  primary key ("postId")
);

create table "users" (
  "userId"         serial,
  "username"       text           not null,
  "hashedPassword" text           not null,
  "createdAt"      timestamptz(6) not null default now(),
  primary key ("userId"),
  unique ("username")
);

create table "messages" (
  "messageId"   serial,
  "senderId"    integer        not null,
  "senderName"  text           not null,
  "recipientId" integer        not null,
  "content"     text           not null,
  "postId"      integer        not null,
  "createdAt"   timestamptz(6) not null default now(),
  primary key ("messageId")
);
