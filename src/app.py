from flask import Flask, render_template

# remember to add Flask request & import requests


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")
