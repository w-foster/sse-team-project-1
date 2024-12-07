from db_client import supabase


def get_most_favourited_items(num_of_items):
    """
    Fetches the most favorited items from the database.

    Args:
        num_of_items (int): The number of items to retrieve.

    Returns:
        list[dict]: A list of dictionaries containing item_id and total_fav.
    """
    try:
        # Call the `get_most_favourited_items` stored function
        response = supabase.rpc(
            "get_most_favourited_items", {"num_of_items": num_of_items}
        ).execute()

        if response.data:
            print(f"Most Favorited Items: {response.data}")
            return response.data
        else:
            print("No data returned from get_most_favourited_items.")
            return []
    except Exception as e:
        print(f"Error fetching most favorited items: {e}")
        return []


if __name__ == "__main__":
    # Example usage
    most_favourited = get_most_favourited_items(5)
    for item in most_favourited:
        print(f"Item ID: {item['item_id']}, Total Favorites: {item['total_fav']}")
