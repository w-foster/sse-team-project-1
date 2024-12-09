from db_client import supabase


def user_already_viewed_item(user_id, item_id):
    """
    Checks if a specific item has already been viewed by a user.

    Parameters:
        user_id (int): The user's identifier.
        item_id (int): The item's identifier.

    Returns:
        bool: True if the item has been viewed by the user, False otherwise.
    """
    try:
        response = (
            supabase.table("item_views")
            .select("*")
            .eq("user_id", user_id)
            .eq("item_id", item_id)
            .execute()
        )
        print(f"ITEM ALREADY VIEWED RESPONSE: {response}")

        # If row exists, response.data will not be empty / null
        if response.data:
            print("RETURNING TRUE FROM ITEM ALR VIEW")
            return True
        else:
            print("RETURNIN FALSE FROM ITEM ALR VIEW")
            return False
    except Exception as e:
        print(f"error checking row existence: {e}")
        return False


def insert_item_view(user_id, item_id, timestamp):
    """
    Inserts a new view record into the 'item_views' table.

    Parameters:
        user_id (int): The user's identifier who viewed the item.
        item_id (int): The identifier of the item viewed.
        timestamp (str): The time at which the item was viewed.

    Returns:
        bool: True if the record was successfully inserted, False otherwise.
    """
    new_row = {"user_id": user_id, "item_id": item_id, "viewed_at": timestamp}

    response = supabase.table("item_views").upsert(new_row).execute()

    if response:
        return True

    return False


def get_most_viewed_items(num_of_items):
    """
    Retrieves the most viewed items from the database using a stored procedure.
    Prints the total views response and handles any issues during execution.

    Parameters:
        num_of_items (int): The number of top items to retrieve based on view counts.

    Returns:
        list: A list of the most viewed items along with their view counts.
    """
    response = supabase.rpc(
        "get_most_viewed_items", {"num_of_items": num_of_items}
    ).execute()

    print(f"TOTAL VIEWS RESPONSE: {response}")

    return response.data
