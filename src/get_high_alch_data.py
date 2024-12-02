from db_client import supabase

def get_high_alch_data():
    try:
        data = []
        limit = 1000  # Supabase's default limit
        offset = 0

        while True:
            # Query Supabase for a range of rows
            response = (
                supabase.table("mapping_data")
                .select("id, highalch")
                .range(offset, offset + limit - 1)  # Fetch rows in chunks of 1000
                .execute()
            )

            # Append fetched rows to data
            if response.data:
                data.extend(response.data)
            else:
                break  # No more rows to fetch

            # Increment offset for the next batch
            offset += limit

        print(f"HIGH ALCH DATA: {data}")
        print(f"LENGTH OF ALCH DATA: {len(data)}")
        return data

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
