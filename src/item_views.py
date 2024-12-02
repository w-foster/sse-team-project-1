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
        # If row exists, response.data will not be empty / null
        if response.data:
            return True
        else:
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
        .insert(new_row)
        .execute()
    )

    if response:
        increment_item_total_views(item_id)
        return True
    
    return False


def increment_item_total_views(item_id):
    try:
        response = (
            supabase.table('item_total_views')
            .select('view_count')
            .eq('item_id', item_id)
        )

        if response:
            current_view_count = response.data[0]['view_count']
            update_response = (
                supabase.table('item_total_views')
                .update({'view_count': current_view_count + 1})
                .eq('item_id', item_id)
                .execute()
            )
            return True
        
        new_row = {
            'item_id': item_id,
            'view_count': 0
        }
        insert_response = (
            supabase.table('item_total_views')
            .insert(new_row)
            .execute()
        )
        return True
    except Exception as e:
        print(f'error updating total views table: {e}')