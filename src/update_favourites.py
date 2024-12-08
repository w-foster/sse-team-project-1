from db_client import supabase


def insert_favourite(user_id, item_id):
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
