from db_client import supabase

# Get user_id from query params
def get_favourites_data(user_id):
    # Query favourites table in DB
    response = (
        supabase.table("favourites")
        .select("item_id")
        .eq("user_id", user_id)
        .execute()
    )
    # Return raw data
    # (error handling + data processing done by caller)
    return response
    
# Example usage:
if __name__ == "__main__":
    data = get_favourites_data(420)
    print(data)