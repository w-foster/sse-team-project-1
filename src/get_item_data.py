import requests
from flask import jsonify



def get_api_data_items():
    api_url = 'https://prices.runescape.wiki/api/v1/osrs/latest'
    try:
        response = requests.get(api_url)
        print("API call made, status code:", response.status_code)
        response.raise_for_status()
        data = response.json()

        filtered_data = [
            {"id": item_id, "high": details.get("high"), "low": details.get("low")}
            for item_id, details in data.get("data", {}).items()
        ]

        final_data = add_other_data(filtered_data)

        print("Filtered data:", filtered_data)  # Debug filtered data
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
                item["margin_percentage"] = ((high - low) / low) * 100
                # Calculate margin
                item["margin"] = high - low
        else:
                # Handle cases where high or low is missing or invalid
                item["margin_percentage"] = None
                item["margin"] = None
    return data

if __name__ == "__main__":
    print("Script is running...")
    get_api_data_items()