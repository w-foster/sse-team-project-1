from db_client import supabase


# Get user_id from query params
def get_favourites_data(user_id):
    # Query favourites table in DB
    response = (
        supabase.table("favourites").select("item_id").eq("user_id", user_id).execute()
    )
    # Return raw data
    # (error handling + data processing done by caller)
    return response.data


# Example usage:
if __name__ == "__main__":
    data = get_favourites_data("0349322c-b338-4a8d-ba8e-407e66d3b4fb")
    print(data)
