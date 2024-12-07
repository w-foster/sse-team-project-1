from get_price_data import get_graph_data


def test_get_price_data():
    assert get_graph_data(1231312, "5m") is None  # Use 'is' to check for None


if __name__ == "__main__":
    test_get_price_data()
