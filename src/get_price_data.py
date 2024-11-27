import requests
from typing import List, Dict, Optional, Tuple


def get_api_data(item_id: int, timestep: str):
    """
    Fetches price data for a given item from the RuneScape prices API.

    Args:
        item_id (int): The ID of the item to fetch data for.
        timestep (str): The timestep for the data (e.g., '5m', '1h', '1d').

    Returns:
        Optional[List[Dict[str, float]]]: The price data for the item as a list of dictionaries,
                                          or None if an error occurred.
    """
    api_url = f"https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep={timestep}&id={item_id}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept': 'application/json',
    }

    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()

        return data["data"]

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


def get_time_series(timestep: str):
    """
    Generates a time series based on the given timestep.

    Args:
        timestep (str): The timestep for the data ('5m', '1h', '1d').

    Returns:
        List[int]: A list of integers representing the time axis based on the timestep.
    """
    time_axis = []
    if timestep == "5m":
        time_axis = [5 * i for i in range(288)]  # 5-minute intervals for a full day
    elif timestep == "1h":
        time_axis = [i for i in range(336)]  # Hourly intervals for a full day
    elif timestep == "1d":
        time_axis = [i for i in range(365)]  # Daily intervals for a year
    else:
        print("Invalid timestep")
    return time_axis


def get_price_and_volume(data: List[Dict[str, float]]):
    """
    Extracts price and volume data from the raw API response.

    Args:
        data (List[Dict[str, float]]): A list of dictionaries containing the price and volume data.

    Returns:
        Tuple[List[float], List[float], List[int], List[int]]:
            - avgHighPrice (List[float]): A list of average high prices.
            - avgLowPrice (List[float]): A list of average low prices.
            - highPriceVolume (List[int]): A list of volumes for high prices.
            - lowPriceVolume (List[int]): A list of volumes for low prices.
    """
    avgHighPrice = [entry["avgHighPrice"] for entry in data]
    avgLowPrice = [entry["avgLowPrice"] for entry in data]
    highPriceVolume = [entry["highPriceVolume"] for entry in data]
    lowPriceVolume = [entry["lowPriceVolume"] for entry in data]

    return avgHighPrice, avgLowPrice, highPriceVolume, lowPriceVolume


def filter_none_values(t_series, x_series, y_series, z_series, w_series):
    # Filter out None values from all series
    return [(t, x, y, z, w) for t, x, y, z, w in zip(t_series, x_series, y_series, z_series, w_series) 
            if x is not None and y is not None and z is not None and w is not None]


def get_graph_data(item_id: int, timestep: str = "5m"):
    """
    Retrieves and formats the graph data for a given item and timestep.

    Args:
        item_id (int): The ID of the item to fetch data for.
        timestep (str): The timestep for the data ('5m', '1h', '1d').

    Returns:
        Optional[Dict[str, List[int] or List[float]]]: A dictionary containing the time series, 
                                                      average high/low prices, and volumes,
                                                      or None if an error occurred.
    """
    data = get_api_data(item_id, timestep)
    if not data:
        return None

    time_series = get_time_series(timestep)
    avgHighPrice, avgLowPrice, highPriceVolume, lowPriceVolume = get_price_and_volume(data)

    time_series_length = len(time_series)

    avgHighPrice = avgHighPrice[:time_series_length]
    avgLowPrice = avgLowPrice[:time_series_length]
    highPriceVolume = highPriceVolume[:time_series_length]
    lowPriceVolume = lowPriceVolume[:time_series_length]

    filtered_data = filter_none_values(time_series, avgHighPrice, avgLowPrice, highPriceVolume, lowPriceVolume)
    filtered_time_series, filtered_avgHighPrice, filtered_avgLowPrice, filtered_highPriceVolume, filtered_lowPriceVolume = zip(*filtered_data) if filtered_data else ([], [], [], [], [])
    
    return {
        "time_series": filtered_time_series,
        "avgHighPrice": filtered_avgHighPrice,
        "avgLowPrice": filtered_avgLowPrice,
        "highPriceVolume": filtered_highPriceVolume,
        "lowPriceVolume": filtered_lowPriceVolume
    }


# Example usage:
if __name__ == "__main__":
    data = get_graph_data(4151, "5m")
    print(len(data["time_series"]), len(data["avgHighPrice"]), len(data["avgLowPrice"]), len(data["highPriceVolume"]), len(data["lowPriceVolume"]))