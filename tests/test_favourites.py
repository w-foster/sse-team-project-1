import pytest
from db_client import supabase
from get_favourites_data import get_favourites_data

# Real user id for a pre-existing test user in the Auth table
TEST_USER_ID = "563cb0d8-57df-4f01-befe-6b7cee3452c6"
# Selection of item IDs to test with
TEST_ITEM_IDS = [2, 10344, 8]

@pytest.fixture
def setup_test_data():
    # Create array of test rows
    test_rows = [{'user_id': TEST_USER_ID, 'item_id': id} for id in TEST_ITEM_IDS]
    # Insert rows to DB
    supabase.table('favourites').insert(test_rows).execute()

    # Run the test
    yield

    # Cleanup test data
    supabase.table('favourites').delete().eq('user_id', TEST_USER_ID).execute()

def test_get_favourites_data(setup_test_data):
    # Make the test call
    data = get_favourites_data(TEST_USER_ID)
    # Construct expected return data and compare it to real data
    expected_data = [{'item_id': id} for id in TEST_ITEM_IDS]
    assert data == expected_data, f"Expected {expected_data}, but got {data}"

def test_get_favourites_for_dummy_user():
    # Make the test call, providing a non-existent user id
    data = get_favourites_data("99999999-9999-9999-9999-999999999999")
    # Compare real data to expected data (where exp. data == [ ])
    assert data == [], f"Expected empty list, but got {data}"

def test_get_favourites_when_user_has_no_favourites():
    # Ensure the test user has no favourites in the DB
    supabase.table('favourites').delete().eq('user_id', TEST_USER_ID).execute()
    # Make the test call, providing the user who has no favourites
    data = get_favourites_data(TEST_USER_ID)
    # Compare real data to expected data (where exp. data == [ ])
    assert data == [], f"Expected empty list, but got {data}"

# def test_get_favourites_for_invalid_user_id():
#     # Make the test call, providing the invalid user id
#     data = get_favourites_data('helloworld')
#     # Compare real data to expected data (where exp. data == [ ])
#     assert data == []


