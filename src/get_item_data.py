import requests
from flask import jsonify
import re
import json
from headers import headers

file_path = '../frontend/runescape-tracker/src/SearchBar/ItemList.js'
with open(file_path, 'r') as f:
    content = f.read()
    
    # Extract the JSON-like part from the JavaScript file
    match = re.search(r"=\s*(\[.*\]);", content, re.DOTALL)
    if match:
        json_content = match.group(1)  # Extract the array
        item_list = json.loads(json_content)
        print("Parsed Item List:", item_list)
    else:
        print("Could not parse JavaScript file!")

def get_api_data_items():
    api_url = 'https://prices.runescape.wiki/api/v1/osrs/latest'
    try:
        response = requests.get(api_url, headers=headers)
        print("API call made, status code:", response.status_code)
        response.raise_for_status()
        data = response.json()

        filtered_data = [
            {"id": item_id, "high": details.get("high"), "low": details.get("low")}
            for item_id, details in data.get("data", {}).items()
        ]

        final_data = add_other_data(filtered_data)

        item_dict = {str(item['id']): item['name'] for item in item_list}

    # Add the "name" field to API data based on the item ID
        for item in final_data:
            item_id = item.get('id')
            item['name'] = item_dict.get(item_id, "Unknown Item")  # Default to "Unknown Item" if no match is found
            print(final_data[:100])
        return final_data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

def add_other_data(data):
    for item in data:
        item["icon"] = "https://discover.therookies.co/content/images/size/w1000/2024/08/11-2.jpg"
        item['favourite'] = False
        high = item.get("high")
        low = item.get("low")
        if high is not None and low is not None and low > 0:
                # Calculate percentage change
                item["margin_percentage"] = round(((high - low) / low) * 100,2)
        else:
                # Handle cases where high or low is missing or invalid
                item["margin_percentage"] = None
    return data

if __name__ == "__main__":
     get_api_data_items()