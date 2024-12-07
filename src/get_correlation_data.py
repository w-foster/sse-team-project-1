from db_client import supabase
import json
from flask import jsonify

"""
target_item_id - the id for which you are getting correlation data
item_id_list - the list of ids for which you want to see the correlations with target_item_id

Example supabase rpc response:
[   
    {'item_id_1': 10344, 'item_id_2': 10350, 'correlation': 0.857418145514517}, 
    {'item_id_1': 10344, 'item_id_2': 12426, 'correlation': 0.434874799394743}, 
    {'item_id_1': 10344, 'item_id_2': 26233, 'correlation': -0.783021972980298}
]

Structure of json payload:
{
    id: correlation,
    id: correlation,
    id: correlation
}
where id is an id from item_id_list, and correlation is the value of 
that item's correlation with the target item (target_item_id)
"""


def get_correlation_data(target_item_id, item_id_list):
    response = supabase.rpc(
        "get_correlation_data",
        {"target_id": target_item_id, "item_ids": item_id_list},
    ).execute()

    print(response.data)
    correlation_data = response.data

    correlation_map = {}

    for row in correlation_data:
        if row["item_id_1"] == target_item_id:
            non_target_id = row["item_id_2"]
            correlation_map[non_target_id] = row["correlation"]
        elif row["item_id_2"] == target_item_id:
            non_target_id = row["item_id_1"]
            correlation_map[non_target_id] = row["correlation"]
        else:
            return None

    return correlation_map
