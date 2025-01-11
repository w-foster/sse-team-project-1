import requests
import re
import json
from headers import headers
import os
from urllib.parse import quote

# Set path and open relevant file
current_dir = os.path.dirname(os.path.abspath(__file__))
item_list_file_path = os.path.join(current_dir, "ItemList.js")


def get_api_data_items():
    """
    Fetches the latest price data from the RuneScape prices API, processes it to include
    additional information, and enriches it with names from a local JavaScript file.

    Returns:
        list[dict] or None: A list of dictionaries containing item data with
                        added attributes like high, low, margin_percentage,
                        and name, or None if an API error occurs.
    """
    api_url = "https://prices.runescape.wiki/api/v1/osrs/latest"
    try:
        response = requests.get(api_url, headers=headers)
        print("API call made, status code:", response.status_code)
        response.raise_for_status()
        data = response.json()

        filtered_data = [
            {
                "id": item_id,
                "high": details.get("high"),
                "low": details.get("low"),
            }
            for item_id, details in data.get("data", {}).items()
        ]

        final_data = add_other_data(filtered_data)
        add_name(final_data)

        return final_data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


def add_other_data(data):
    """
    Enhances a list of item data dictionaries with a favorite flag and calculates
    the percentage price margin between the high and low prices.

    Parameters:
        data (list of dict): List of item dictionaries
                             each containing 'high' and 'low' price keys.
    Returns:
        list[dict]: The enhanced data list,
                    with each dictionary now including an 'name' key.

    This function iteratively adds calculation results and flags to original item data.
    """
    for item in data:
        item["favourite"] = False
        high = item.get("high")
        low = item.get("low")
        if high is not None and low is not None and low > 0:
            # Calculate percentage change
            item["margin_percentage"] = round(((high - low) / low) * 100, 2)
        else:
            # Handle cases where high or low is missing or invalid
            item["margin_percentage"] = None
    return data


def add_name(data):
    """
    Adds item names to a list of item data dictionaries from a local JavaScript file that
    contains item information.

    Parameters:
        data (list of dict): List of item dictionaries that need item names added.

    Returns:
        list[dict]: Enhanced data list, with each dictionary including a 'name' key.
    """
    file_path = item_list_file_path
    with open(file_path, "r") as f:
        content = f.read()

    # Extract the JSON-like part from the JavaScript file
    match = re.search(r"=\s*(\[.*\]);", content, re.DOTALL)
    json_content = match.group(1)  # Extract the array
    item_list = json.loads(json_content)
    item_dict = {str(item["id"]): item["name"] for item in item_list}

    # Add the "name" field to API data based on the item ID
    for item in data:
        url_safe_name = quote(item.wiki_name)
        icon_link = (
            "https://tools.runescape.wiki/osrs-dps/cdn/equipment/{url_safe_name}.png"
        )
        item_id = item.get("id")
        item["name"] = item_dict.get(item_id, "Unknown Item")
    return data


if __name__ == "__main__":
    get_api_data_items()
