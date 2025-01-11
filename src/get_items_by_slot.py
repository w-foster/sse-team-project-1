from get_equipable_items import filter_equipable_items
from headers import headers
from collections import defaultdict
import requests
import json


def filter_by_slot(allow_quest_items=False):
    items = filter_equipable_items()

    items_by_slot = defaultdict(list)
    for item in items:
        if not allow_quest_items and not item.quest_item:
            items_by_slot[item.equipment.slot].append(item)
        else:
            items_by_slot[item.equipment.slot].append(item)

    return items_by_slot


def fetch_price_data():
    api_url = "https://prices.runescape.wiki/api/v1/osrs/latest"
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


def add_price_attribute(items):
    osrs_api_data = fetch_price_data()["data"]
    for slot, item_list in items.items():
        print(slot)
        for item in item_list:
            item_id = str(item.id)
            if item_id in osrs_api_data:
                item.has_price_data = True
                item.high_price = osrs_api_data[item_id]["high"]
                item.low_price = osrs_api_data[item_id]["low"]
            else:
                item.has_price_data = False
                item.high_price = None
                item.low_price = None


def get_items_by_slot():
    items = filter_by_slot()
    add_price_attribute(items)
    return items


def prepare_items_for_frontend(items_by_slot):
    """
    Input should be dictionary of slot, item_list pairs
    where each item_list is a list of ItemProperties objects
    """
    json_structure = {}

    for slot, item_list in items_by_slot.items():
        json_structure[slot] = []

        for item in item_list:
            item_dict = item.construct_json()
            # Add icon link
            url_safe_name = item.name.replace(" ", "%20")
            item_dict["icon"] = (
                f"https://tools.runescape.wiki/osrs-dps/cdn/equipment/{url_safe_name}.png"
            )
            # print(icon_link)
            # item_dict["icon"] = (
            #     f"https://services.runescape.com/m=itemdb_rs/obj_sprite.gif?id={item.id}"
            # )
            # Add dynamically added attributes manually
            if hasattr(item, "high_price"):
                item_dict["high_price"] = item.high_price
            if hasattr(item, "low_price"):
                item_dict["low_price"] = item.low_price
            if hasattr(item, "has_price_data"):
                item_dict["has_price_data"] = item.has_price_data

            json_structure[slot].append(item_dict)

    return json.dumps(json_structure, indent=4)


# if __name__ == "__main__":
#     items = get_items_by_slot()
#     json_data = prepare_items_for_frontend(items)
