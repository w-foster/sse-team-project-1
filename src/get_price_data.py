import requests
from typing import List, Dict
from headers import headers


def get_api_data(item_id: int, timestep: str):
    """
    Fetches price data for a given item from the RuneScape prices API.

    Parameters:
        item_id (int): The ID of the item to fetch data for.
        timestep (str): The timestep for the data (e.g., '5m', '1h', '24h').

    Returns:
        Optional[List[Dict[str, float]]]: The price data for the item,
                                          or None if an error occurred.
    """
    api_url = (
        "https://prices.runescape.wiki/api/v1/osrs/"
        f"timeseries?timestep={timestep}&id={item_id}"
    )

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

    Parameters:
        timestep (str): The timestep for the data ('5m', '1h', '24h').

    Returns:
        List[int]: A list of integers representing the time axis based on the timestep.
    """
    time_axis = []
    if timestep == "5m":
        time_axis = [5 * i for i in range(288)]  # 5-minute intervals for a full day
    elif timestep == "1h":
        time_axis = [i for i in range(336)]  # Hourly intervals for a full day
    elif timestep == "24h":
        time_axis = [i for i in range(365)]  # Daily intervals for a year
    else:
        print("Invalid timestep")
    return time_axis


def get_price_and_volume(data: List[Dict[str, float]]):
    """
    Extracts price and volume data from the raw API response.

    Parameters:
        data (List[Dict[str, float]]): Containing the price and volume data.

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
    """
    Filters out None values from series of time and corresponding data points.

    Parameters:
        t_series (List): List of time points.
        x_series, y_series, z_series, w_series (List): Corresponding data series.

    Returns:
        List[Tuple]: List of tuples containing only the entries where no element is None.
    """
    return [
        (t, x, y, z, w)
        for t, x, y, z, w in zip(t_series, x_series, y_series, z_series, w_series)
        if x is not None and y is not None and z is not None and w is not None
    ]


def get_graph_data(item_id: int, timestep: str = "5m", filter: bool = True):
    """
    Retrieves and formats the graph data for a given item and timestep.

    Parameters:
        item_id (int): The ID of the item to fetch data for.
        timestep (str): The timestep for the data ('5m', '1h', '24h').
        filter (bool): If True filters out None values. Default to True.

    Returns:
        Optional[Dict[str, List[int] or List[float]]]: Containing time series,
                                                average high/low prices, and volumes,
                                                or None if an error occurred.
    """
    data = get_api_data(item_id, timestep)
    if not data:
        return None

    time_series = get_time_series(timestep)
    avgHighPrice, avgLowPrice, highPriceVolume, lowPriceVolume = get_price_and_volume(
        data
    )

    time_series_length = len(time_series)

    avgHighPrice = avgHighPrice[:time_series_length]
    avgLowPrice = avgLowPrice[:time_series_length]
    highPriceVolume = highPriceVolume[:time_series_length]
    lowPriceVolume = lowPriceVolume[:time_series_length]

    if filter:
        filtered_data = filter_none_values(
            time_series,
            avgHighPrice,
            avgLowPrice,
            highPriceVolume,
            lowPriceVolume,
        )
        (
            time_series,
            avgHighPrice,
            avgLowPrice,
            highPriceVolume,
            lowPriceVolume,
        ) = (
            zip(*filtered_data) if filtered_data else ([], [], [], [], [])
        )

    return {
        "time_series": time_series,
        "avgHighPrice": avgHighPrice,
        "avgLowPrice": avgLowPrice,
        "highPriceVolume": highPriceVolume,
        "lowPriceVolume": lowPriceVolume,
    }


if __name__ == "__main__":
    data = get_graph_data(4151, "5m")
    print(
        len(data["time_series"]),
        len(data["avgHighPrice"]),
        len(data["avgLowPrice"]),
        len(data["highPriceVolume"]),
        len(data["lowPriceVolume"]),
    )
