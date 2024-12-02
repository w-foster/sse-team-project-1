import random
import json

def get_random_id():
    with open('src/ItemList.json', 'r') as file:
        item_list = json.load(file)
    """
    Get a random id from a list of items.
    """

    # Generate a random element from the list
    random_item = random.choice(item_list)

    # Return the random item
    return random_item

if __name__ == "__main__":
    print(get_random_id())