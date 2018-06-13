import database_connector
import data_handler
import psycopg2.sql as sql
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
        result = data_handler.get_board_ids_out(board_ids)
        return result
    return None


@database_connector.connection_handler
def get_boards(cursor, username):
    boards = get_board_ids(username)
    if boards:
        query = sql.SQL("""
                        SELECT * FROM boards
                        WHERE id IN ({vals})
                        """).format(
                            vals=sql.SQL(", ").join(sql.Placeholder()*len(boards)))
        cursor.execute(query, boards)
        new_boards = cursor.fetchall()
        return new_boards
    return None


@database_connector.connection_handler
def delete_card(cursor, value):
    cursor.execute("""
                    DELETE FROM cards
                    WHERE id = %s
                    """, (value))
    return None


@database_connector.connection_handler
def is_board_name_in_use(cursor, board, user_id):
    cursor.execute("""
                    SELECT boards.id FROM boards
                    LEFT JOIN boards_accounts ON boards.id = boards_accounts.board_id
                    WHERE boards_accounts.account_id = %s AND boards.title = %s
                    """, (user_id, board))
    return cursor.fetchall()


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
    return board_id[0]["id"]


@database_connector.connection_handler
def add_account_board_connection(cursor, user_id, board_id):
    cursor.execute("""
                    INSERT INTO boards_accounts
                    VALUES (%s, %s)
                    """, (user_id, board_id))


@database_connector.connection_handler
def get_cards(cursor, board_ids):
    if board_ids:
        query = sql.SQL("""
                        SELECT * FROM cards
                        WHERE board_id IN ({vals})
                        """).format(
                            vals=sql.SQL(", ").join(sql.Placeholder()*len(board_ids)))
        cursor.execute(query, board_ids)
        new_cards = cursor.fetchall()
        return new_cards
    return None


@database_connector.connection_handler
def save_card(cursor, title, board_id):
    cursor.execute("""
                    INSERT INTO cards (title, board_id, status_id)
                    VALUES (%s, %s, 1)
                    """, (title, board_id))





@database_connector.connection_handler
def edit_card(cursor, newName, oldName):
    cursor.execute("""
                    UPDATE cards
                    SET title = %s
                    WHERE title = %s
                    """, (newName, oldName))
    return None
