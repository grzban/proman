import database_connector
from werkzeug.security import generate_password_hash, check_password_hash


# check database if username already exists
@database_connector.connection_handler
def is_user_in_database(cursor, username):
    cursor.execute("""
                    SELECT username FROM accounts
                    WHERE LOWER(username) = LOWER(%(username)s);
                    """, {'username': username})
    if cursor.fetchall():
        return True
    return False


@database_connector.connection_handler
def register_user(cursor, username, password):
    cursor.execute("""
                    INSERT INTO accounts (username, password)
                    VALUES (%(username)s, %(password)s);
                    """, {'username': username, 'password': generate_password_hash(password)})


@database_connector.connection_handler
def login(cursor, username, password):
    cursor.execute("""
                    SELECT username, password FROM accounts
                    WHERE LOWER(username) = LOWER(%(username)s)
                    """, {'username': username})
    user = cursor.fetchall()[0]

    if check_password_hash(user['password'], password):
        return user['username']
    return None


@database_connector.connection_handler
def get_user_id(cursor, username):
    if is_user_in_database(username):
        cursor.execute("""
                        SELECT id FROM accounts
                        WHERE LOWER(username) = LOWER(%(username)s)
                        """, {'username': username})
        user_id = cursor.fetchall()[0]
        return user_id
    return None
