from db_client import supabase

def get_most_favourited(num_of_items):
    response = supabase.rpc('get_most_favourited', {'num_of_items': num_of_items}).execute()
    print(f"TOTAL FAVOURITED RESPONSE: {response}") 
    return response.data

# Example usage:
if __name__ == "__main__":
    data = get_most_favourited(10)
    print(data)