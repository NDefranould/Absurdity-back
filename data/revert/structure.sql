-- Revert absurdity:structure from pg

BEGIN;

DROP TABLE IF EXISTS

"users", 
"roles", 
"answers", 
"questions", 
"users_has_answers";



COMMIT;
