-- Deploy absurdity:02.admin to pg

BEGIN;

UPDATE users SET pseudo = 'Profil supprimé', email='profilsupprime@profilsupprimer.fr' WHERE users.id = 1;

UPDATE users SET role_id=1 WHERE users.id = 19;


COMMIT;
