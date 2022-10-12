-- Deploy absurdity:03_delete_cascade to pg

BEGIN;

ALTER TABLE users_has_answers 
DROP CONSTRAINT users_has_answers_question_id_fkey;
ALTER TABLE users_has_answers 
add CONSTRAINT users_has_answers_question_id_fkey
FOREIGN key (question_id)
REFERENCES questions (id)
ON DELETE CASCADE;

ALTER TABLE users_has_answers 
DROP CONSTRAINT users_has_answers_answer_id_fkey;
ALTER TABLE users_has_answers 
add CONSTRAINT users_has_answers_answer_id_fkey
FOREIGN key (answer_id)
REFERENCES answers (id)
ON DELETE CASCADE;

ALTER TABLE answers 
DROP CONSTRAINT answers_question_id_fkey;
ALTER TABLE answers 
add CONSTRAINT answers_question_id_fkey
FOREIGN key (question_id)
REFERENCES questions (id)
ON DELETE CASCADE;



COMMIT;
