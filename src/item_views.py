from db_client import supabase

def user_already_viewed_item(user_id, item_id):
    try:
        response = (
            supabase.table('item_views')
            .select('*')
            .eq('user_id', user_id)
            .eq('item_id', item_id)
            .execute()
        )
        print(f"ITEM ALREADY VIEWED RESPONSE: {response}")
        # If row exists, response.data will not be empty / null
        if response.data:
            print('RETURNING TRUE FROM ITEM ALR VIEW')
            return True
        else:
            print('RETURNIN FALSE FROM ITEM ALR VIEW')
            return False
    except Exception as e:
        print(f'error checking row existence: {e}')
        return False




def insert_item_view(user_id, item_id, timestamp):
    new_row = {
        'user_id': user_id,
        'item_id': item_id,
        'viewed_at': timestamp
    }

    response = (
        supabase.table('item_views')
        .upsert(new_row)
        .execute()
    )

    if response:
        return True
    
    return False


def get_most_viewed_items(num_of_items):
    response = supabase.rpc('get_most_viewed_items', {'num_of_items': num_of_items}).execute()
    print(f"TOTAL VIEWS RESPONSE: {response}") 
    return response.data

    