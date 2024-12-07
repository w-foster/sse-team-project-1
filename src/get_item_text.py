from db_client import supabase


def get_item_description(item_id):
    """
    Query Supabase to fetch the item description based on the item_id.

    Args:
        item_id (int): The ID of the item.

    Returns:
        str: The item description if found, or None if not found.
    """
    try:
        print(f"Querying item ID: {item_id} (type: {type(item_id)})")  # Debugging

        # Query Supabase for the description
        response = (
            supabase.table("mapping_data")  # Replace with your table name
            .select("examine")  # Replace with your column name
            .eq("id", item_id)  # Replace "id" if your column name differs
            .execute()
        )

        # Print raw response for debugging
        print(f"Supabase Response: {response.data}")

        # Handle no data found
        if not response.data or len(response.data) == 0:
            print(f"No data found for item ID: {item_id}")
            return None

        # Return the description
        return response.data[0].get("examine")

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


if __name__ == "__main__":
    get_item_description()
