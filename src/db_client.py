import os
from dotenv import load_dotenv
from supabase import create_client


# Load environment variables from .env file (for local development)
if os.getenv("TSURU_APPNAME") is None:  # Check if running in Tsuru
    load_dotenv()

# Retrieve the Supabase URL and Key from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set as environment variables")


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
