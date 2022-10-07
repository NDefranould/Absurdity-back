-- Deploy absurdity:structure to pg

BEGIN;


CREATE TABLE IF NOT EXISTS "roles" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ 

);
CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "pseudo" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "role_id" INTEGER NOT NULL DEFAULT 2 REFERENCES roles(id),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE IF NOT EXISTS "questions" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "content" TEXT NOT NULL UNIQUE,
    "already_asked" BOOLEAN NOT NULL DEFAULT '0',
    "date_of_publication" TIMESTAMPTZ,
    "question_of_the_day" BOOLEAN NOT NULL DEFAULT '0',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ 
);

CREATE TABLE IF NOT EXISTS "answers" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "content" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT '0',
    "user_id" INTEGER NOT NULL REFERENCES users(id),
    "question_id" INTEGER NOT NULL REFERENCES questions(id),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ 

);


CREATE TABLE IF NOT EXISTS "users_has_answers" (
    "user_id" INTEGER NOT NULL REFERENCES users(id),
    "answer_id" INTEGER NOT NULL REFERENCES answers(id),
    "question_id" INTEGER NOT NULL REFERENCES questions(id),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ 

);

INSERT INTO "roles" (name) VALUES 
    ('admin'), 
    ('user');


 INSERT INTO "questions" (content, question_of_the_day) VALUES
 ('Savez-vous planter des choux ?', '0'),
('Qu''est-ce qui est Jonathan ?', '0'),
 ('Qu''avez-vous pensé de la présentation?', '1');


COMMIT;
