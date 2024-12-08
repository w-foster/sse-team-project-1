import pytest
import sys
import os
import asyncio

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from db_client import supabase
from get_item_text import get_item_description  # Replace with your actual module name

# Predefined constants for test
TEST_ITEM_ID = 123456
TEST_ITEM_DESCRIPTION = "This is a test description."


@pytest.fixture
async def setup_test_data():
    # Insert the test item into the database
    response = await supabase.table("mapping_data").insert({
        "id": TEST_ITEM_ID,
        "examine": TEST_ITEM_DESCRIPTION
    }).execute()

    # Yield for the test to run
    yield

    # Cleanup: Delete the test item after the test
    delete_response = await supabase.table("mapping_data").delete().eq("id", TEST_ITEM_ID).execute()
    if delete_response.status_code != 200:
        raise Exception(f"Failed to delete test data: {delete_response.data}")


def test_get_item_description_valid(setup_test_data):
    """
    Test that `get_item_description` correctly retrieves an existing item's description.
    """
    # Call the function with the test item ID
    description = get_item_description(TEST_ITEM_ID)

    # Assert that the description matches the expected value
    assert description == TEST_ITEM_DESCRIPTION, f"Expected '{TEST_ITEM_DESCRIPTION}', but got '{description}'"


def test_get_item_description_invalid():
    """
    Test that `get_item_description` returns None when the item ID does not exist.
    """
    # Call the function with a non-existent item ID
    description = get_item_description(999999)

    # Assert that the result is None
    assert description is None, f"Expected None, but got '{description}'"
