from flask import Flask, render_template, send_from_directory, request, jsonify
from db_client import supabase
from get_favourites_data import get_favourites_data


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
    # Store user_id from query params
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is reqiured'}), 400
    
    # Call helper function to get favourites data from DB
    supabase_response = get_favourites_data(user_id)
    if supabase_response.get('error'):
        return jsonify({'error': supabase_response['error']}), 500
    
    data = jsonify(supabase_response.get('data', []))
    return data

if __name__ == "__main__":
    app.run(debug=True)


