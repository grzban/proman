CREATE TABLE accounts (
    id serial NOT NULL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR
);

CREATE TABLE boards (
    id serial NOT NULL PRIMARY KEY,
    title VARCHAR
);

CREATE TABLE cards (
    id serial NOT NULL PRIMARY KEY,
    board_id INTEGER,
    status_id INTEGER,
    title VARCHAR,
    FOREIGN KEY (board_id) REFERENCES boards(id)
);

CREATE TABLE boards_accounts (
    account_id INTEGER,
    board_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (board_id) REFERENCES boards(id)
);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY boards_accounts
    ADD CONSTRAINT fk_accounts_id FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;

ALTER TABLE ONLY boards_accounts
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
