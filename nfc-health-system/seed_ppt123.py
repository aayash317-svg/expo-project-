import requests
import uuid
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

# Supabase Setup
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

TEST_NFC_ID = "PPT123"

def seed_test_patient():
    print(f"Checking for patient with NFC ID: {TEST_NFC_ID}...")
    
    # Check if patient exists in 'patients' table
    res = supabase.table('patients').select("*").eq('nfc_tag_id', TEST_NFC_ID).execute()
    
    if res.data:
        print(f"Patient found: {res.data[0]['id']}")
        return res.data[0]['id']

    print("Patient not found. Creating new test patient 'PPT123'...")
    
    # 1. Create User via Auth (Strictly speaking we can just insert into profiles if no FK constraint to auth.users, but usually there is)
    # But usually we can't insert into auth.users directly via Client.
    # However, if 'profiles' has FK to 'auth.users', we are blocked unless we use Service Key or SIGN UP.
    
    email = f"test_pt_{str(uuid.uuid4())[:8]}@example.com"
    password = "password123"
    
    try:
        # Create Auth User
        print(f"creating user {email}...")
        auth = supabase.auth.sign_up({"email": email, "password": password})
        if not auth.user:
             print("Auth failed.")
             return None
             
        uid = auth.user.id
        print(f"Auth created: {uid}")

        # 2. Insert Profile (If not auto-created by trigger)
        print("Creating/Updating Profile...")
        try:
            supabase.table('profiles').insert({
                "id": uid, 
                "role": "patient", 
                "full_name": "Test Patient (PPT123)", 
                "email": email
            }).execute()
        except Exception as e:
            print(f"Profile insert failed (likely trigger exists): {e}")
            # Optional: Update the name if you want
            # supabase.table('profiles').update({"full_name": "Test Patient (PPT123)"}).eq("id", uid).execute()
        
        # 3. Insert Patient Record
        print(f"Creating Patient Record with NFC {TEST_NFC_ID}...")
        supabase.table('patients').insert({
            "id": uid, 
            "nfc_tag_id": TEST_NFC_ID, 
            "dob": "1990-01-01",
            "blood_type": "O+"
        }).execute()

        print("✅ SUCCESS: Patient 'PPT123' created!")
        return uid

    except Exception as e:
        print(f"❌ Failed to create patient: {e}")
        return None

if __name__ == "__main__":
    seed_test_patient()
