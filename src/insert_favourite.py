from supabase import create_client
import requests
import json

# CHANGE THIS TO TSURU ENV VARS LATER!
SUPABASE_URL = "https://lacstwcjmfdrnebmmpdl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3N0d2NqbWZkcm5lYm1tcGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTE1NzgsImV4cCI6MjA0ODEyNzU3OH0.tankWlViseqQUzaR5wxQfuJoc8WxTLl28jBOotlBPbY"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

api_url = "https://prices.runescape.wiki/api/v1/osrs/mapping"

def insert_favourite(user_id, item_id):
    # Insert a new row to 'favourites'
    new_row = {
        'user_id': user_id,
        'item_id': item_id
    }

    response = (
        supabase.table('favourites')
        .insert(new_row)
        .execute()
    )

    if response.get('error'):
        return False
    else:
        return True

def delete_favourite(user_id, item_id):
    response = (
        supabase.table('favourites')
        .delete()
        .eq('user_id', user_id)
        .eq('item_id', item_id)
        .execute()
    )

    if response.get('error'):
        return False
    else:
        return True
