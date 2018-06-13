from flask import Flask, render_template, session, request, redirect, url_for
import data_manager
import data_handler
import json

app = Flask(__name__)
app.secret_key = "CalmDownSatan"


@app.route("/", methods=["POST", "GET"])
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if "username" in session:
        username = session["username"]
        board_ids = data_manager.get_board_ids(username)
        user_id = data_manager.get_user_id(username)
        boards = json.dumps(data_manager.get_boards(username))
        cards = json.dumps(data_manager.get_cards(board_ids))
        statuses = json.dumps(data_handler.get_statuses()["statuses"])
        return render_template("boards.html", username=username, user_id=user_id, boards=boards, cards=cards, statuses=statuses)
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
    if not data_manager.is_board_name_in_use(board, user_id):
        data_manager.add_board(board, user_id)
    return redirect(url_for("boards"))


@app.route("/save-card", methods=["POST"])
def save_card():
    card = request.form["new-card-title"]
    board_id = request.form["board-id-new-card"]
    data_manager.save_card(card, board_id)
    return redirect(url_for("boards"))


@app.route("/delete-card", methods=["POST"])
def delete_card():
        deleted_card_id = request.form["delCardNum"]
        data_manager.delete_card(deleted_card_id)
        return redirect(url_for("boards"))

@app.route("/delete-board", methods=["POST"])
def delete_board():
        deleted_board_id = request.form["delBoardNum"]
        data_manager.delete_card(deleted_board_id)
        return redirect(url_for("boards"))


@app.route("/edit-card", methods=["POST"])
def edit_card():
        edited_card_id = request.form["edCardNum"]
        edited_card_new_name = request.form["newCardName"]
        data_manager.edit_card(edited_card_new_name, edited_card_id)
        return redirect(url_for("boards"))


def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()
