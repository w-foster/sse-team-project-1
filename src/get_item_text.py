from db_client import supabase


def get_item_description(item_id):
    """
    Query Supabase to fetch the item description based on the item_id.

    Parameters:
        item_id (int): The ID of the item.

    Returns:
        str: The item description if found, or None if not found.
    """
    try:
        # For debugging
        # print(f"Querying item ID: {item_id} (type: {type(item_id)})")

        # Query Supabase for the description
        response = (
            supabase.table("mapping_data")
            .select("examine")
            .eq("id", item_id)
            .execute()
        )

        # Print raw response for debugging
        # print(f"Supabase Response: {response.data}")

        if not response.data or len(response.data) == 0:
            print(f"No data found for item ID: {item_id}")
            return None

        return response.data[0].get("examine")

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


if __name__ == "__main__":
    get_item_description()
