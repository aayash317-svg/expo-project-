import os
import sys
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

print(f"URL: {url}")
print(f"Key Type: {'Anon' if 'anon' in key else 'Service'}")

# 1. Anonymous Client
anon_client = create_client(url, key)
print("\n--- Attempting Anonymous Scan (PPT123) ---")
try:
    res = anon_client.table('patients').select("*").eq('nfc_tag_id', 'PPT123').execute()
    if res.data:
        print(f"✅ FOUND in Anon Mode: {res.data[0]['id']}")
    else:
        print("❌ NOT FOUND in Anon Mode (RLS blocking?)")
except Exception as e:
    print(f"❌ ERROR: {e}")

# 2. Authenticated Client (Simulating Hospital)
# We need to login as a hospital first to get a token
# We'll use the hospital credential from verify_api.py (if known) or register one.
print("\n--- Authenticating as Hospital ---")
email = "vishwa123@gmail.com" # From trace
password = "password123" # Guessing? Or I should use verify_api creds?
# Actually, I'll use verify_api helper? No, just raw.
# I'll try to login with Council ID logic?
# Wait, I don't know the password for "vishwa hospital".
# I'll register a NEW hospital for this test.

import uuid
test_council = f"TEST_HOSP_{str(uuid.uuid4())[:6]}"
test_email = f"{test_council}@nfc-health.system" # Fake email logic
test_pass = "password123"

# Register via Auth (to get token)
print(f"Registering temp hospital: {test_council}...")
try:
    auth = anon_client.auth.sign_up({"email": test_email, "password": test_pass}) # Using System Email logic
    if auth.user:
        token = auth.session.access_token
        print("✅ Logged in. Token obtained.")
        
        # Now create an Authenticated Client
        # Option A: reuse anon_client but set session?
        # Option B: create new client with headers?
        
        # supabase-py doesn't easily convert anon client to auth client for data queries unless we use postgrest directly with header.
        # But `supabase.auth.set_session` might work?
        
        auth_client = create_client(url, key)
        auth_client.postgrest.auth(token) # Set JWT for subsequent requests
        
        # INSERT INTO HOSPITALS (Crucial if RLS checks 'hospitals' table)
        print("Inserting into hospitals table...")
        try:
            auth_client.table('profiles').insert({"id": auth.user.id, "role": "hospital", "full_name": "Debug H", "email": test_email}).execute()
            auth_client.table('hospitals').insert({"id": auth.user.id, "license_number": test_council, "verified": True}).execute()
            print("✅ Hospital Record Created.")
        except Exception as e:
            print(f"⚠️ Hospital Insert Failed (maybe okay if profile exists): {e}")

        print("\n--- Attempting Authenticated Scan ---")
        res_auth = auth_client.table('patients').select("*").eq('nfc_tag_id', 'PPT123').execute()
        if res_auth.data:
             print(f"✅ FOUND in Auth Mode: {res_auth.data[0]['id']}")
        else:
             print("❌ NOT FOUND in Auth Mode (RLS blocking even for Hospital?)")

    else:
        print("❌ Auth failed.")

except Exception as e:
    print(f"❌ Auth Error: {e}")
