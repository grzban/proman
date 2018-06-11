from flask import Flask, render_template, session, request, redirect, url_for
import data_manager

app = Flask(__name__)
app.secret_key = "codecoolSux"


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if "username" in session:
        username = session["username"]
        return render_template("boards.html", username=username)
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


def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()
