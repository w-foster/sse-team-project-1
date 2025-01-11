from osrsreboxed import items_api
from pprint import pprint


def print_items(items):
    for item in items:
        pprint(item.__dict__)


def load_all_items():
    items = items_api.load()
    return items


def filter_equipable_items():
    all_db_items = load_all_items()
    equipable_items = []
    for item in all_db_items:
        if item.equipable_by_player:
            equipable_items.append(item)
    return equipable_items


if __name__ == "__main__":
    items = filter_equipable_items()
    print_items(items)
