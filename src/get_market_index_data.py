from get_price_data import get_graph_data

def get_market_index_graph_data(timestep: str = "5m"):
    # Define the basket of item IDs for the market index
    #basket_of_items = [4151, 2]  # Example item IDs
    basket_of_items = [453, 2353, 444, 561, 560, 7936, 1515, 1513, 1739, 377, 7944, 1799, 1761, 225, 231, 3000, 263, 4151, 11840, 13024, 10034, 8778, 385, 1753, 536, 2, 11284]
    
    # Fetch data for each item
    item_data_list = []
    for item_id in basket_of_items:
        data = get_graph_data(item_id, timestep)
        if data and len(data["time_series"]) > 0:
            item_data_list.append((item_id, data))

    if not item_data_list:
        # No data available for any items
        return None

    # Use the first dataset as a reference for length
    reference_length = len(item_data_list[0][1]["time_series"])
    reference_time_series = item_data_list[0][1]["time_series"]

    # Filter out any item whose length doesn't match reference
    # This is a simple approach; you might want more sophisticated alignment logic.
    filtered_item_data = []
    for item_id, d in item_data_list:
        if len(d["time_series"]) == reference_length:
            filtered_item_data.append((item_id, d))

    if not filtered_item_data:
        return None

    # Determine base prices:
    # We want a base price from a specific date. Since 24h data goes back 365 days, 
    # let's assume we're using that dataset as the source of base prices.
    # For now, just pick the first point in the current dataset as a placeholder.
    # If we want a stable base (e.g., from exactly one year ago), we could:
    # - Fetch the 24h data for each item separately and use day 0's midpoint as the base.
    # For demonstration, let's do a separate call for 24h data and get the first point:
    base_prices = {}
    for item_id, d in filtered_item_data:
        if timestep == "24h":
            # If we're already on the 24h interval, just use the first data point
            base_avg_high = d["avgHighPrice"][0]
            base_avg_low = d["avgLowPrice"][0]
            base_price = (base_avg_high + base_avg_low) / 2
            base_prices[item_id] = base_price
        else:
            # If not on 24h, let's fetch 24h data to get the base price
            # (In a real scenario, you might have it stored in a database.)
            base_data = get_graph_data(item_id, "24h")
            if base_data and len(base_data["time_series"]) > 0:
                base_avg_high = base_data["avgHighPrice"][0]
                base_avg_low = base_data["avgLowPrice"][0]
                base_price = (base_avg_high + base_avg_low) / 2
                base_prices[item_id] = base_price
            else:
                # If we can't get base price data for this item, skip it
                pass

    # Filter again in case some items don't have a base price
    filtered_item_data = [
        (item_id, d) for (item_id, d) in filtered_item_data 
        if item_id in base_prices
    ]

    if not filtered_item_data:
        return None

    # Now calculate index values:
    # For each time step:
    #   - For each item:
    #     - current_price = midpoint of avgHighPrice and avgLowPrice at this time
    #     - ratio = current_price / base_price[item]
    #   - average all ratios for all items at this time
    #   - multiply by 100
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
            # If no ratios (no items?), append None or skip
            indexValues.append(None)

    # Filter out any None values if needed, or assume all are good
    # For simplicity, we assume all have data. Otherwise, you'd need a filtering step.

    return {
        "time_series": reference_time_series,
        "indexValues": indexValues
    }


# Example usage:
if __name__ == "__main__":
    data = get_market_index_graph_data("24h")
    if data:
        print("Time series length:", len(data["time_series"]))
        print("Index values length:", len(data["indexValues"]))
        print(data)
    else:
        print("No market index data available.")
