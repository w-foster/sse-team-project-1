from flask import Flask, render_template, send_from_directory, request, jsonify
from db_client import supabase
from get_favourites_data import get_favourites_data
from get_item_data import get_api_data_items
from get_hot_items import get_api_hot_items
from update_favourites import insert_favourite, delete_favourite
from flask_cors import CORS
from get_price_data import get_graph_data

app = Flask(__name__, static_folder='../frontend/runescape-tracker/build', static_url_path='')  # Update the static folder path
CORS(app, resources={r"/react/api/*": {"origins": "http://localhost:3000"}})



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

    insert_favourite(user_id, item_id)

    return jsonify({'message': 'Favourite added to DB successfully'}), 201

# Remove a row from DB, according to user_id and item_id specified
@app.route('/react/api/favourites/<int:item_id>', methods=['DELETE'])
def remove_favourite(item_id):
    user_id = request.args.get('user_id')

    if not user_id or not item_id:
        return jsonify({'error': 'user_id and item_id are required'}), 400

    delete_favourite(user_id, item_id)

    return jsonify({'message': 'Favourite removed from DB successfully'}), 201

# Add the /react/items endpoint using the get_api_data function from get_item_data.py
@app.route('/react/api/items', methods=['GET'])
def items():
    return jsonify(get_api_data_items())

# Route to handle incoming price data requests from React
@app.route('/react/api/price', methods=['GET'])
def get_price_data():
    item_id = request.args.get('item_id', type=int)
    
    if not item_id:
        return jsonify({"error": "Item ID is required"}), 400
    
    # Get price data for the item
    # Store the data in a list using a list comprehension
    time_intervals = ["5m", "1h", "24h"]
    all_price_data = [get_graph_data(item_id, interval) for interval in time_intervals]
    
    if all_price_data is None:
        return jsonify({"error": "Unable to fetch price data for the given item"}), 500
    
    return jsonify(all_price_data)

@app.route('/react/api/hotitems', methods=['GET'])
def items():
    return jsonify(get_api_hot_items())

if __name__ == "__main__":
    app.run(debug=True)


