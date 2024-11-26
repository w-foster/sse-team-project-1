import requests
import json

def get_price_data(item_id, timestep):
    api_url = f"https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep={timestep}&id={item_id}"

    try:
        response = requests.get(api_url)

        response.raise_for_status()

        data = response.json()

        print(json.dumps(data, indent=4))


    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

get_price_data(4151, "5m")