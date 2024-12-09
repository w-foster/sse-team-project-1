import os
from dotenv import load_dotenv
from supabase import create_client

# CHANGE THIS TO TSURU ENV VARS LATER!
# SUPABASE_URL = "https://lacstwcjmfdrnebmmpdl.supabase.co"
# SUPABASE_KEY = (
#     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey"
#     "Jpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3N0d"
#     "2NqbWZkcm5lYm1tcGRsIiwicm9sZSI6ImFub24i"
#     "LCJpYXQiOjE3MzI1NTE1NzgsImV4cCI6MjA0ODE"
#     "yNzU3OH0.tankWlViseqQUzaR5wxQfuJoc8WxTLl28jBOotlBPbY"
# )

# Load environment variables from .env file (for local development)
if os.getenv("TSURU_APPNAME") is None:  # Check if running in Tsuru
    load_dotenv()

# Retrieve the Supabase URL and Key from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set as environment variables")


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
