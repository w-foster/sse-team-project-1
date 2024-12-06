from get_price_data import get_graph_data
import json
import numpy as np
import pandas as pd
import pickle


def calculate_correlations(print_nan_stats: bool=False, filter_amount: int=100):
    print('DEBUGGING. FUNC ENTERED')
    """
    Computes pairwise correlations between time series data for items listed in a JSON file.
    
    Args:
        print_nan_stats (bool): Whether to print statistics about NaN counts in the data.
        filter_amount (int): Maximum number of NaN values allowed per row. Rows exceeding 
                             this threshold are filtered out.
    
    Returns:
        pd.DataFrame: A DataFrame containing pairs of item IDs and their correlation coefficients.
    """
    file_path = "ItemList.json"

    with open(file_path, 'r') as file:
        data = json.load(file)
        
    # isolate id data
    id_data = [item["id"] for item in data]

    # store time series data with ids as key
    time_series_dict = {}

    # get price data for each item id
    for id in id_data:
        try:
            # Retrieve price data
            price_data = get_graph_data(id, "24h", False)
            
            # Calculate average of high and low price
            average_price = []
            for high, low in zip(price_data["avgHighPrice"], price_data["avgLowPrice"]):
                if high is not None and low is not None:
                    average_price.append((high + low) / 2)
                else:
                    average_price.append(None)  # Skip calculation but keep structure
                    
            # Store in dictionary
            time_series_dict[id] = average_price
        except Exception as e:
            # Log or print the error for debugging
            print(f"Skipping ID {id} due to error: {e}")
            continue
    
    # create pandas dataframe
    df = pd.DataFrame.from_dict(time_series_dict, orient="index")

    if print_nan_stats:
        # calculate and display NaN statistics
        na_counts = df.isna().sum(axis=1)
        na_stats = {
            'Mean': int(na_counts.mean()),
            'Median': int(na_counts.median()),
            'Min': int(na_counts.min()),
            'Max': int(na_counts.max()),
            'over 100': int((na_counts>=100).sum()),
            'over 150': int((na_counts>=150).sum()),
            'over 200': int((na_counts>=200).sum())
        }
        print(f"\nNaN Counts Statistics (with {df.shape[0]} items)", na_stats, "\n")
        print(f"")
    
    if filter_amount:
        # filter for rows with too many na values
        df = df[df.isna().sum(axis=1) <= filter_amount]

    # transpose dataframe
    df_t = df.T

    # calculate correlation matrix
    correlation_matrix = df_t.corr()

    # extract the indices for the upper triangle of the matrix
    rows, cols = np.triu_indices_from(correlation_matrix, k=1)

    # extract correlations using these indices
    correlations = correlation_matrix.values[rows, cols]

    # extract pairs of column names corresponding to the indices
    pairs = [(correlation_matrix.index[i], correlation_matrix.columns[j]) for i, j in zip(rows, cols)]

    # new dataframe storing pair and correlation
    correlation_pairs_df = pd.DataFrame({
        'Item1': [pair[0] for pair in pairs],
        'Item2': [pair[1] for pair in pairs],
        'Correlation': correlations
    })

    # save the python object to a pickle file, for debugging
    correlation_pairs_df.to_pickle('correlations.pkl')
    # return the df to caller func
    return correlation_pairs_df
   
 
# example usage:
if __name__ == "__main__":
    df = calculate_correlations(print_nan_stats=True)
    print(df.head())
    print(df.shape)