from flask import Flask, render_template, send_from_directory, request, jsonify
from db_client import supabase
from get_favourites_data import get_favourites_data
from get_item_data import get_api_data_items
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/runescape-tracker/build', static_url_path='')  # Update the static folder path
CORS(app, resources={r"/*": {"origins": "*"}})



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

    # HANDLE ERROR HERE SOMEHOW ? not with .get('error) it broke it 
    
    # Extract 'data' (array of objects)
    item_data = supabase_response.data
    # Build array of item_ids and return jsonified version
    item_ids = [item['item_id'] for item in item_data]
    return jsonify(item_ids)

# Add a row to DB containing a user_id and a new favourite item_id
@app.route('/react/api/favourites', methods=['POST'])
def add_favourite():
    data = request.json

    if not data or "user_id" not in data or "item_id" not in data:
        return jsonify({'error': 'user_id and item_id are required'}), 400
    
    user_id = data['user_id']
    item_id = data['item_id']

    # add to database

    return jsonify({'message': 'Favourite added to DB successfully'}), 201

# Remove a row from DB, according to user_id and item_id specified
@app.route('/react/api/favourites/<int:item_id>', methods=['DELETE'])
def remove_favourite(item_id):
    user_id = request.args.get('user_id')

    if not user_id or not item_id:
        return jsonify({'error': 'user_id and item_id are required'}), 400

    # remove from database

    return jsonify({'message': 'Favourite removed from DB successfully'}), 201

# Add the /react/items endpoint using the get_api_data function from get_item_data.py
@app.route('/api/items', methods=['GET'])
def items():
    return jsonify(get_api_data_items())

if __name__ == "__main__":
    app.run(debug=True)


