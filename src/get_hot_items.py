import requests
from headers import headers
from get_item_data import add_name


def get_api_hot_items():
    """
    Fetches recent trading data for items from the RuneScape prices API
    and processes it to identify the hottest items based on trading volume.

    Returns:
        list[dict] or None: A list of dictionaries containing the hottest items,
                            enhanced with average price and volume data,
                            and enriched with item names from a local source,
                            or None if an API error occurs.
    """
    api_url = "https://prices.runescape.wiki/api/v1/osrs/1h"
    try:
        response = requests.get(api_url, headers=headers)
        print("API call made, status code:", response.status_code)
        response.raise_for_status()
        data = response.json()

        filtered_data = [
            {
                "id": item_id,
                "high": details.get("avgHighPrice"),
                "low": details.get("avgLowPrice"),
                "high_vol": details.get("highPriceVolume"),
                "low_vol": details.get("lowPriceVolume"),
            }
            for item_id, details in data.get("data", {}).items()
        ]

        final_data = find_averages(filtered_data)

        add_name(final_data)

        return final_data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


def find_averages(data):
    # Calculate averages for each item
    averaged_data = [
        {
            "id": item["id"],
            "avg_price": round(
                ((item.get("high", 0) or 0) + (item.get("low", 0) or 0)) / 2, 2
            ),  # Average of high and low price
            "avg_vol": round(
                ((item.get("high_vol", 0) or 0) + (item.get("low_vol", 0) or 0)) / 2,
                2,
            ),  # Average of high and low volume
        }
        for item in data
    ]

    # Filter items with non-zero average volume
    valid_items = [item for item in averaged_data if item["avg_vol"] > 0]

    # Sort by average volume in descending order
    sorted_items = sorted(valid_items, key=lambda x: x["avg_vol"], reverse=True)

    # Return top 10 items
    return sorted_items[:10]


if __name__ == "__main__":
    get_api_hot_items()
