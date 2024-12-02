from db_client import supabase


def get_high_alch_data():
    try:
        # Query Supabase for the description
        response = (
            supabase.table("mapping_data")  # Replace with your table name
            .select("id", "highalch")              # Replace with your column name
            .execute()
        )

        # Print raw response for debugging
        print(f"Supabase Response: {response.data}")

        # Handle no data found
        if not response.data or len(response.data) == 0:
            print(f"No data found for high alching")
            return None

        # Return the description
        return response.data

    except Exception as e:
        print(f"An error occurred: {e}")
        return None