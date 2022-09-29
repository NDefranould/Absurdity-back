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
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ 

);

INSERT INTO "roles" (name) VALUES 
    ('admin'), 
    ('user');

INSERT INTO "users" (pseudo,password,email, role_id) VALUES
 ('Nicolas', 'nicolas','nicolas@nicolas.com', 2),
 ('Joris', 'joris','joris@joris.com', 1),
 ('Nabiha', 'nabiha', 'nabiha@nabiha.com', 1),
 ('Thibault', 'thibault','thibault@thibault.com', 1),
 ('Romain', 'romain', 'romain@romain.com', 2),
 ('ChouRaveDu93', 'chouravedu93','chouravedu93@chouravedu93.com', 2),
 ('Fleur-Choux', 'fleur-choux','fleur-rcohoux@fleur-rcohoux.com', 2),
 ('ChoupinetteDu75', 'choupinettedu75', 'choupinettedu75s@choupinettedu75s.com', 2);
 
 INSERT INTO "questions" (content, already_asked, date_of_publication) VALUES
 ('Savez-vous planter des choux ?', '1', CURRENT_TIMESTAMP);
 INSERT INTO "answers" (content, vote_count, user_id, question_id) VALUES 
 ('oui.', 532, 6, 1),
 ('Choux. Fleur. Choux. Fleur.', 385, 7, 1),
 ('c koi 1 chou ? xptdr', 198, 8, 1);

 INSERT INTO "questions" (content) VALUES
 ('Qu"est qui est Jonathan ?');

COMMIT;
