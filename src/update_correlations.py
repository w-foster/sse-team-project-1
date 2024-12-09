from db_client import supabase
from calculate_correlations import calculate_correlations

# Define size of batch DB upserts
BATCH_SIZE = 1000


def update_correlations():
    """
    Updates the 'correlations' table in the Supabase database with new correlation data.
    This function reads a DataFrame of item correlations,
    and performs batch upserts to efficiently update the table.
    """
    # Read in the pandas df from the pickle file for debugging
    # correlation_df = pd.read_pickle('correlations.pkl')

    # Columns: Item1 (int), Item2 (int), Correlation (float)
    correlation_df = calculate_correlations(print_nan_stats=False)

    # Rename df columns to match Supabase table schema
    correlation_df.rename(
        columns={
            "Item1": "item_id_1",
            "Item2": "item_id_2",
            "Correlation": "correlation",
        },
        inplace=True,
    )

    # Ensure each item id is an integer (sometimes arrives as <id>.0)
    correlation_df["item_id_1"] = correlation_df["item_id_1"].astype(int)
    correlation_df["item_id_2"] = correlation_df["item_id_2"].astype(int)

    # Split DataFrame into batches
    for i in range(0, len(correlation_df), BATCH_SIZE):
        batch = correlation_df.iloc[i : i + BATCH_SIZE]

        # Prepare batch as a list of dictionaries
        rows = batch.to_dict(orient="records")

    try:
        supabase.table("correlations").upsert(rows).execute()  # Batch upsert
        print(f"Upserted batch {i // BATCH_SIZE + 1}")
    except Exception as e:
        print(f"Failed to upsert batch {i // BATCH_SIZE + 1}: {e}")


if __name__ == "__main__":
    print("UPDATING DB CORRELATIONS TABLE\n")
    update_correlations()
    print("FINISHED UPDATING DB CORRELATIONS TABLE\n")
