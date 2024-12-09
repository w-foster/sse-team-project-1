from db_client import supabase


def insert_favourite(user_id, item_id):
    """
    Inserts a new favourite item for a user into the 'favourites' table in Supabase.

    Parameters:
        user_id (int): The ID of the user for whom the favourite item is being added.
        item_id (int): The ID of the item to add to the user's favourites.

    Returns:
        list: A list containing the newly added favourite row if successful,
              or an empty list if unsuccessful.

    Raises:
        Exception: Prints an error message if the insertion fails.
    """
    try:
        # Insert a new row to 'favourites'
        new_row = {"user_id": user_id, "item_id": item_id}
        response = supabase.table("favourites").insert(new_row).execute()

        # If successful, supabase returns the row in the 'data' field
        if response.data:
            return response.data
        # Unsuccessful otherwise
        else:
            return []
    except Exception as e:
        print(f"Error inserting favourite: {e}")
        return []


def delete_favourite(user_id, item_id):
    """
    Deletes a favourite item for a user from the 'favourites' table in Supabase.

    Parameters:
        user_id (int): The ID of the user whose favourite item is being deleted.
        item_id (int): The ID of the item to delete from the user's favourites.

    Returns:
        list: A list containing the deleted favourite row if successful,
              or an empty list if no rows were deleted.

    Raises:
        Exception: Prints an error message if the deletion fails.
    """
    try:
        response = (
            supabase.table("favourites")
            .delete()
            .eq("user_id", user_id)
            .eq("item_id", item_id)
            .execute()
        )

        if response.data:
            return response.data
        else:
            return []
    except Exception as e:
        print(f"Error deleting favourite: {e}")
        return []
