import os
import uuid
import sys
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
print(f"Connecting to {url}...")
supabase = create_client(url, key)

email = f"debug_pt_{str(uuid.uuid4())[:6]}@example.com"
print(f"Attempting to signup: {email}")

try:
    auth_resp = supabase.auth.sign_up({
        "email": email,
        "password": "password12345"
    })
    
    if not auth_resp.user:
        print("❌ Auth User is None. Response might be error?")
        print(f"Auth Session: {auth_resp.session}")
    else:
        print(f"✅ Auth Created: {auth_resp.user.id}")
        uid = auth_resp.user.id
        
        # Profile
        print("Inserting Profile...")
        try:
             supabase.table('profiles').insert({"id": uid, "role": "patient", "full_name": "Debug Patient", "email": email}).execute()
             print("✅ Profile Created")
        except Exception as e:
             print(f"⚠️ Profile Fail: {e}")

        # Patient
        print("Inserting Patient...")
        try:
             supabase.table('patients').insert({"id": uid, "nfc_tag_id": "PPT123", "dob": "2000-01-01"}).execute()
             print("✅ Patient PPT123 Created")
        except Exception as e:
             print(f"❌ Patient Fail: {e}")

except Exception as e:
    print(f"❌ CRITICAL FAIL: {e}")
