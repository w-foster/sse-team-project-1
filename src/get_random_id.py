import os
import random
import json


def get_random_id():
    this_directory = os.path.dirname(os.path.abspath(__file__))

    # Possible locations of ItemList.json
    possible_paths = [
        os.path.join(this_directory, "ItemList.json"),
        os.path.join(this_directory, "src", "ItemList.json"),
    ]

    # Try to find the file in the possible paths
    for path in possible_paths:
        if os.path.isfile(path):
            with open(path, "r") as file:
                item_list = json.load(file)
            break
    else:
        raise FileNotFoundError("Could not find 'ItemList.json' in expected locations.")

    # Generate a random element from the list
    random_item = random.choice(item_list)

    # Return the random item
    return random_item


if __name__ == "__main__":
    print(get_random_id())
