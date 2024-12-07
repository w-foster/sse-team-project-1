from get_price_data import get_graph_data
from get_favourites_data import get_favourites_data
from get_most_favourited import get_most_favourited_items
from get_random_id import get_random_id


def test_get_graph_data_day():
    assert get_graph_data(1231312, "5m") is None


def test_get_graph_data_year():
    assert get_graph_data(4151, "24h")


def test_get_favourites_data():
    assert get_favourites_data("0349322c-b338-4a8d-ba8e-407e66d3b4fb")


def test_get_most_favourited():
    assert get_most_favourited_items(5)


def test_get_random_id():
    assert get_random_id()


if __name__ == "__main__":
    print(get_graph_data(1231312, "5m"))
    print(get_graph_data(4151, "24h"))
    print(get_favourites_data("0349322c-b338-4a8d-ba8e-407e66d3b4fb"))
    print(get_most_favourited_items(5))
    print(get_random_id())
