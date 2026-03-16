SET search_path TO public;

DELETE FROM account_sessions
WHERE account_session_id IN (1, 5, 8, 10, 11, 12, 13);

DELETE FROM accounts
WHERE account_id IN (34, 35, 36, 37, 38);

SET search_path TO public;
