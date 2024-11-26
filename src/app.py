from flask import Flask, render_template, send_from_directory
from supabase import create_client

app = Flask(__name__, static_folder='../frontend/runescape-tracker/build', static_url_path='')  # Update the static folder path


# CHANGE THIS TO TSURU ENV VARS LATER!
SUPABASE_URL = "https://lacstwcjmfdrnebmmpdl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3N0d2NqbWZkcm5lYm1tcGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTE1NzgsImV4cCI6MjA0ODEyNzU3OH0.tankWlViseqQUzaR5wxQfuJoc8WxTLl28jBOotlBPbY"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route("/")
def index():
    response = supabase.table("favourites").select("user_id").execute()
    return str(response)
    # return render_template('index.html')

@app.route("/react")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

# Serve static files (e.g., JavaScript, CSS)
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(f"{app.static_folder}/static", path)

if __name__ == "__main__":
    app.run(debug=True)


