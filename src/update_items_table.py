from supabase import create_client
import requests
import json

# CHANGE THIS TO TSURU ENV VARS LATER!
SUPABASE_URL = "https://lacstwcjmfdrnebmmpdl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3N0d2NqbWZkcm5lYm1tcGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTE1NzgsImV4cCI6MjA0ODEyNzU3OH0.tankWlViseqQUzaR5wxQfuJoc8WxTLl28jBOotlBPbY"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

api_url = "https://prices.runescape.wiki/api/v1/osrs/mapping"

try:
    response = requests.get(api_url)

    response.raise_for_status()

    data = response.json()

    for item in data:
        if "limit" in item:
            item["buylimit"] = item.pop("limit")

    response = supabase.table("mapping_data").upsert(data).execute()

except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
