from get_price_data import get_graph_data


def get_market_index_graph_data(timestep: str = "5m"):
    """
    Calculates a market index based on a basket of items over a specified timestep.

    This function fetches price data for each item in the basket,
    aligns the time series data, computes base prices, and then calculates an index
    value at each time step by averaging the price ratios of all items
    relative to their base prices.

    Parameters:
        timestep (str): The granularity of the data ('5m', '1h', '24h'). Defaults to '5m'.

    Returns:
        Optional[Dict[str, List]]: A dictionary containing 'time_series'
                                and 'indexValues' lists. 'time_series' represents
                                the timeline, and 'indexValues' are the calculated
                                index values at each time point.
                                Returns None if no data is available or an error occurs.

    The process includes:
    - Fetching data for each item in a predefined basket.
    - Filtering out items based on data availability and length consistency.
    - Calculating base prices for each item to serve as reference points.
    - Computing index values as average of price ratios to base prices, multiplied by 100.
    """
    # Define the basket of item IDs for the market index
    basket_of_items = [
        453,
        2353,
        444,
        561,
        560,
        7936,
        1515,
        1513,
        1739,
        377,
        7944,
        1799,
        1761,
        225,
        231,
        3000,
        263,
        4151,
        11840,
        13024,
        10034,
        8778,
        385,
        1753,
        536,
        2,
        11284,
    ]

    # Fetch data for each item
    item_data_list = []
    for item_id in basket_of_items:
        data = get_graph_data(item_id, timestep)
        if data and len(data["time_series"]) > 0:
            item_data_list.append((item_id, data))

    if not item_data_list:
        return None

    # Use the first dataset as a reference for length
    reference_length = len(item_data_list[0][1]["time_series"])
    reference_time_series = item_data_list[0][1]["time_series"]

    # Filter out any item whose length doesn't match reference
    filtered_item_data = []
    for item_id, d in item_data_list:
        if len(d["time_series"]) == reference_length:
            filtered_item_data.append((item_id, d))

    if not filtered_item_data:
        return None

    base_prices = {}
    for item_id, d in filtered_item_data:
        if timestep == "24h":
            # If already on the 24h interval, just use the first data point
            base_avg_high = d["avgHighPrice"][0]
            base_avg_low = d["avgLowPrice"][0]
            base_price = (base_avg_high + base_avg_low) / 2
            base_prices[item_id] = base_price
        else:
            # If not on 24h, fetch 24h data to get the base price
            base_data = get_graph_data(item_id, "24h")
            if base_data and len(base_data["time_series"]) > 0:
                base_avg_high = base_data["avgHighPrice"][0]
                base_avg_low = base_data["avgLowPrice"][0]
                base_price = (base_avg_high + base_avg_low) / 2
                base_prices[item_id] = base_price
            else:
                pass

    # Filter again
    filtered_item_data = [
        (item_id, d) for (item_id, d) in filtered_item_data if item_id in base_prices
    ]

    if not filtered_item_data:
        return None

    indexValues = []
    for i in range(reference_length):
        ratios_at_time_i = []
        for item_id, d in filtered_item_data:
            current_high = d["avgHighPrice"][i]
            current_low = d["avgLowPrice"][i]
            current_price = (current_high + current_low) / 2.0
            base_price = base_prices[item_id]

            if base_price > 0:
                ratio = current_price / base_price
                ratios_at_time_i.append(ratio)

        if ratios_at_time_i:
            avg_ratio = sum(ratios_at_time_i) / len(ratios_at_time_i)
            index_value = avg_ratio * 100
            indexValues.append(index_value)
        else:
            indexValues.append(None)

    return {"time_series": reference_time_series, "indexValues": indexValues}


if __name__ == "__main__":
    data = get_market_index_graph_data("24h")
    if data:
        print("Time series length:", len(data["time_series"]))
        print("Index values length:", len(data["indexValues"]))
        print(data)
    else:
        print("No market index data available.")
