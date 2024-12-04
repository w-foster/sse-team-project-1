from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_cors import CORS
import os
from db_client import supabase
from get_favourites_data import get_favourites_data
from get_most_favourited import get_most_favourited_items
from get_item_data import get_api_data_items
from get_hot_items import get_api_hot_items
from update_favourites import insert_favourite, delete_favourite
from get_price_data import get_graph_data
from get_item_text import get_item_description
from item_views import user_already_viewed_item, insert_item_view, get_most_viewed_items
from get_high_alch_data import get_high_alch_data
from get_random_id import get_random_id
from get_market_index_data import get_market_index_graph_data
from datetime import datetime

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')  # Update the static folder path
CORS(app)

@app.route("/", defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # If the request matches a file in the static folder, serve it
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Otherwise, serve index.html (the React app)
        return send_from_directory(app.static_folder, 'index.html')

# Serve static files (e.g., JavaScript, CSS)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.static_folder, 'static'), filename)

# Get favourite item data for the logged in user
@app.route('/api/favourites', methods=['GET'])
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
@app.route('/api/favourites', methods=['POST'])
def add_favourite():
    data = request.json

    if not data or "user_id" not in data or "item_id" not in data:
        return jsonify({'error': 'user_id and item_id are required'}), 400
    
    user_id = data['user_id']
    item_id = data['item_id']

    insert_favourite(user_id, item_id)

    return jsonify({'message': 'Favourite added to DB successfully'}), 201

# Remove a row from DB, according to user_id and item_id specified
@app.route('/api/favourites/<int:item_id>', methods=['DELETE'])
def remove_favourite(item_id):
    user_id = request.args.get('user_id')

    if not user_id or not item_id:
        return jsonify({'error': 'user_id and item_id are required'}), 400

    delete_favourite(user_id, item_id)

    return jsonify({'message': 'Favourite removed from DB successfully'}), 201

# Add the /items endpoint using the get_api_data function from get_item_data.py
@app.route('/api/items', methods=['GET'])
def items():
    return jsonify(get_api_data_items())

# Route to handle incoming price data requests from React
@app.route('/api/price', methods=['GET'])
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


@app.route('/api/market-index', methods=['GET'])
def get_market_index_data():
    time_intervals = ["5m", "1h", "24h"]
    index_data = [get_market_index_graph_data(interval) for interval in time_intervals]

    if any(d is None for d in index_data):
        return jsonify({"error": "Unable to fetch market index data"}), 500

    return jsonify(index_data)


@app.route('/api/getRandomId', methods=['GET'])
def get_random_item():
    item = get_random_id()
    return jsonify(item)


@app.route('/api/hotitems', methods=['GET'])
def hotitems():
    return jsonify(get_api_hot_items())


@app.route('/api/high-alch', methods=['GET'])
def high_alch():
    return jsonify(get_high_alch_data())

# Route to handle item description
@app.route('/api/item-description/<int:item_id>', methods=['GET'])
def item_description(item_id):
    """
    Fetch and return the item description for the given item ID.
    """
    description = get_item_description(item_id)

    if description is None:
        return jsonify({"error": "Description not found for the given item"}), 404

    return jsonify({"description": description})

@app.route('/api/itemview', methods=['POST'])
def item_view():
    data = request.json
    
    if not data or 'user_id' not in data or 'item_id' not in data:
        return jsonify({'error': 'user_id and item_id are required'}), 400
    
    user_id = data['user_id']
    item_id = data['item_id']

    # Check if the user has already viewed the item
    if (user_already_viewed_item(user_id, item_id)):
        return jsonify({'message': 'user already viewed item'}), 200
    
    # If not, insert a row in item_views, which will also increment total views
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    insert_item_view(user_id, item_id, current_time)

    return jsonify({'message': 'successfully processed item view'}), 200

@app.route('/api/popular-items', methods=['GET'])
def popular_items():
    num_of_items = request.args.get('num_of_items')
    if not num_of_items:
        return jsonify({'error': 'num_of_items is required'}), 400
    
    response = get_most_viewed_items(num_of_items)
    return jsonify(response)


@app.route('/api/most_favourited', methods=['GET'])
def favourited_items():
    num_of_items = request.args.get('num_of_items')
    if not num_of_items:
        return jsonify({'error': 'num_of_items is required'}), 400
    
    response = get_most_favourited_items(num_of_items)
    return jsonify(response)


@app.route('/<path:path>')
def catchall(path):
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)