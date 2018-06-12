import database_connector
import data_handler
from werkzeug.security import generate_password_hash, check_password_hash


# check database if username already exists
@database_connector.connection_handler
def is_user_in_database(cursor, username):
    cursor.execute("""
                    SELECT username FROM accounts
                    WHERE LOWER(username) = LOWER(%(username)s);
                    """, {"username": username})
    return cursor.fetchall()


@database_connector.connection_handler
def register_user(cursor, username, password):
    cursor.execute("""
                    INSERT INTO accounts (username, password)
                    VALUES (%(username)s, %(password)s);
                    """, {"username": username, "password": generate_password_hash(password)})


@database_connector.connection_handler
def login(cursor, username, password):
    cursor.execute("""
                    SELECT username, password FROM accounts
                    WHERE LOWER(username) = LOWER(%(username)s)
                    """, {"username": username})
    user = cursor.fetchall()[0]

    if check_password_hash(user["password"], password):
        return user["username"]
    return None


@database_connector.connection_handler
def get_user_id(cursor, username):
    if is_user_in_database(username):
        cursor.execute("""
                        SELECT id FROM accounts
                        WHERE LOWER(username) = LOWER(%(username)s)
                        """, {"username": username})
        user_id = cursor.fetchall()[0]
        return user_id["id"]
    return None


@database_connector.connection_handler
def get_board_ids(cursor, username):
    user_id = get_user_id(username)
    if user_id:
        cursor.execute("""
                        SELECT board_id FROM boards_accounts
                        WHERE account_id = (%(user_id)s)
                        """, {"user_id": user_id})
        board_ids = cursor.fetchall()
        return board_ids
    return None


@database_connector.connection_handler
def get_boards(cursor, username):
    board_ids = get_board_ids(username)
    if board_ids:
        cursor.execute("""
                        SELECT * FROM boards
                        WHERE id IN (%(board_ids)s)
                        """, {"board_ids": board_ids})
        boards = cursor.fetchall()
        return boards
    return None


@database_connector.connection_handler
def delete_from_table(cursor, table, column, value):
    cursor.execute("""
                    DELETE FROM (%(table)s)
                    WHERE (%(column)s) = (%(value)s)
                    """, {"table": table, "column": column, "value": value})

    return None


@database_connector.connection_handler
def add_board(cursor, board, user_id):
    cursor.execute("""
                    INSERT INTO boards (title)
                    VALUES (%(board)s)
                    """, {"board": board})
    board_id = get_board_id(board)
    add_account_board_connection(user_id, board_id)


@database_connector.connection_handler
def get_board_id(cursor, board):
    cursor.execute("""
                    SELECT id FROM boards
                    WHERE title = (%(board)s)
                    """, {"board": board})
    board_id = cursor.fetchall()
    return board_id


@database_connector.connection_handler
def add_account_board_connection(cursor, user_id, board_id):
    cursor.execute("""
                    INSERT INTO boards_accounts
                    VALUES ((%(user_id)s), (%(board_id)s))
                    """, {"user_id": user_id, "board_id": board_id})
