from flask import Flask, render_template, session, request, redirect, url_for
import data_manager

app = Flask(__name__)
app.secret_key = "CalmDownSatan"


@app.route("/", methods=["POST", "GET"])
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if "username" in session:
        username = session["username"]
        user_id = data_manager.get_user_id(username)
        boards = data_manager.get_boards(username)
        if request.method == "POST":
            deleted_card_id = request.form["delCardNum"]
            data_manager.delete_from_table("cards", "id", deleted_card_id)
        return render_template("boards.html", username=username, user_id=user_id, boards=boards)
    else:
        return render_template("boards.html")


@app.route("/login", methods=["POST"])
def login():
    user = request.form

    if data_manager.is_user_in_database(user["username-login"]):
        if data_manager.login(user["username-login"], user["password-login"]):
            session["username"] = user["username-login"]
            return redirect(url_for("boards"))
    else:
        msg = "Invalid data, try again"
        return render_template("boards.html", msg=msg)


@app.route("/signup", methods=["POST"])
def signup():
    user = request.form

    if data_manager.is_user_in_database(user["username-signup"]):
        msg = "Please choose a different username"
        return render_template("boards.html", msg=msg)
    else:
        data_manager.register_user(user["username-signup"], user["password-signup"])
        session["username"] = user["username-signup"]
        return redirect(url_for("boards"))


@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("boards"))


@app.route("/save-board", methods=["POST"])
def save_board():
    board = request.form["new-board-title"]
    username = session["username"]
    user_id = data_manager.get_user_id(username)
    if data_manager.is_board_name_in_use(board, user_id):
        data_manager.add_board(board, user_id)
    return redirect(url_for("boards"))


def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()
