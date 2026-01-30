import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

try:
    print("Listing ALL patients...")
    res = supabase.table('patients').select("nfc_tag_id, id").execute()
    
    if res.data:
        print("✅ Found Patients:")
        for p in res.data:
            print(f" - NFC: {p['nfc_tag_id']} (ID: {p['id']})")
    else:
        print("❌ No patients found in database.")

except Exception as e:
    print(f"Error listing patients: {e}")
