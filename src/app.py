from flask import Flask, render_template, send_from_directory, request, jsonify
from db_client import supabase


app = Flask(__name__, static_folder='../frontend/runescape-tracker/build', static_url_path='')  # Update the static folder path



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

# Get favourite item data for the logged in user
@app.route('/react/api/favourites', methods=['GET'])
def get_favourites():
    return None

if __name__ == "__main__":
    app.run(debug=True)


