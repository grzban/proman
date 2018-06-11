from flask import Flask, render_template, session, request, redirect, url_for

app = Flask(__name__)
app.secret_key = "codecoolSux"


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if session["username"]:
        username = session["username"]
        return render_template("boards.html", username=username)
    return render_template("boards.html")


# @app.route("/login")
# def login():


def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()
