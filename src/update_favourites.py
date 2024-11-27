from db_client import supabase

api_url = "https://prices.runescape.wiki/api/v1/osrs/mapping"

def insert_favourite(user_id, item_id):
    # Insert a new row to 'favourites'
    new_row = {
        'user_id': user_id,
        'item_id': item_id
    }

    response = (
        supabase.table('favourites')
        .insert(new_row)
        .execute()
    )

    # handle supabase error here (not with .get)
    return response

def delete_favourite(user_id, item_id):
    response = (
        supabase.table('favourites')
        .delete()
        .eq('user_id', user_id)
        .eq('item_id', item_id)
        .execute()
    )

    # handle supabase error here (not with .get)
    return response

if __name__ == "__main__":
    print("Deleting 420's 9999")
    delete_favourite(420, 9999)

