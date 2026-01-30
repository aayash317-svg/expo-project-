from flask import Blueprint, request, jsonify, session
from supabase_client import get_supabase_client

bp = Blueprint('api', __name__, url_prefix='/api')

def get_fake_email(council_id):
    """Constructs a system email from Council ID to allow Supabase Auth"""
    clean_id = str(council_id).strip().lower().replace(" ", "")
    return f"{clean_id}@nfc-health.system"

# --- Authentication ---

@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    council_id = data.get('council_id')
    email = data.get('email') # Contact email
    password = data.get('password')

    if not all([name, council_id, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    supabase = get_supabase_client()
    system_email = get_fake_email(council_id)

    try:
        # 1. Create Auth User
        auth_res = supabase.auth.sign_up({
            "email": system_email,
            "password": password,
            "options": {
                "data": {
                    "full_name": name,
                    "council_id": council_id,
                    "contact_email": email
                }
            }
        })
        
        user = auth_res.user
        if not user:
            return jsonify({'error': 'Registration failed (User creation)'}), 400

        # 2. Insert into Profiles (Required by Schema RLS)
        try:
             supabase.table('profiles').insert({
                "id": user.id,
                "email": email,
                "role": "hospital",
                "full_name": name
            }).execute()
        except Exception as e:
            # Cleanup user if profile fails? For now, just log/error. 
             return jsonify({'error': f'Profile creation failed: {str(e)}'}), 400

        # 3. Insert into Hospitals
        try:
            supabase.table('hospitals').insert({
                "id": user.id,
                "license_number": council_id,
                "verified": False
            }).execute()
        except Exception as e:
            return jsonify({'error': f'Hospital record creation failed: {str(e)}'}), 400

        return jsonify({'message': 'Registration successful'}), 201

    except Exception as e:
        msg = str(e)
        if 'profiles_email_key' in msg or 'duplicate key value' in msg:
             return jsonify({'error': 'This email address or ID is already registered. Please login or use a different one.'}), 400
        if 'Database error saving new user' in msg:
             return jsonify({'error': 'Registration block by database. This ID/Email likely already exists (Trigger Error). Try a different Council ID.'}), 400
        return jsonify({'error': 'Registration Error: ' + msg}), 400

@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    council_id = data.get('council_id')
    password = data.get('password')
    
    if not council_id or not password:
        return jsonify({'error': 'Missing Council ID or Password'}), 400

    system_email = get_fake_email(council_id)
    
    # Check if user entered a real email address
    if '@' in council_id:
        return jsonify({'error': 'Please login using your Medical Council ID (the one you registered with), NOT your email address.'}), 400

    print(f"Login attempt: Input='{council_id}' -> Email='{system_email}'") # Debug Log
    supabase = get_supabase_client()

    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email": system_email,
            "password": password
        })
        
        user = auth_res.user
        session['user_id'] = user.id
        session['access_token'] = auth_res.session.access_token
        # Store metadata in session
        session['user_name'] = user.user_metadata.get('full_name', 'Hospital')
        session['council_id'] = council_id
        
        return jsonify({'message': 'Login successful', 'redirect': '/dashboard'}), 200

    except Exception as e:
        msg = str(e)
        if 'Invalid login credentials' in msg:
             return jsonify({'error': 'Invalid Council ID or Password'}), 401
        return jsonify({'error': 'Registration/Login Error: ' + msg}), 400

# --- Patient Data ---

@bp.route('/patient/scan', methods=['POST'])
def scan_patient():
    data = request.get_json()
    scan_data = data.get('scan_data')

    # Security: Ensure User is Logged In
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized: Please login first'}), 401

    if not scan_data:
        return jsonify({'error': 'No scan data provided'}), 400

    supabase = get_supabase_client()
    
    # Try finding by NFC ID
    try:
        response = supabase.table('patients').select("*").eq('nfc_tag_id', scan_data).execute()
        if response.data:
            patient = response.data[0]
            # Need to fetch the NAME from PROFILES
            prof_res = supabase.table('profiles').select("full_name").eq("id", patient['id']).execute()
            if prof_res.data:
                patient['full_name'] = prof_res.data[0]['full_name']
            else:
                patient['full_name'] = "Unknown"
            
            return jsonify({'patient_id': patient['id'], 'redirect': f'/patient/{patient["id"]}/view'}), 200
        else:
             return jsonify({'error': 'Patient not found'}), 404
             # Note: We are strictly reading from Supabase now. We don't auto-create patients here 
             # because we aren't creating full Supabase auth users for them in this generic scan flow easily.
             # Integration assumes patients already exist in the portal.
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/patient/<uuid:patient_id>/records', methods=['GET'])
def get_records(patient_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    supabase = get_supabase_client()
    try:
        # Fetch records
        # Note: 'hospitals' link might be tricky if RLS prevents viewing other hospitals' names.
        # But 'medical_records' table has 'hospital_id'.
        records_res = supabase.table('medical_records') \
            .select("*") \
            .eq('patient_id', str(patient_id)) \
            .order('created_at', desc=True) \
            .execute()
            
        data = records_res.data
        
        # Enrich with Hospital Names manually if join fails (Foreign Key logic)
        for r in data:
            # Ideally: Join query.
            # Simplified: Just show ID or placeholder if we can't join "hospitals" table easily due to RLS.
            # RLS "Hospitals view created records" -> ONLY their own.
            # WAIT. RLS "Hospitals view created records" using (auth.uid() = hospital_id)
            # This means Hospital A CANNOT see Hospital B's records for the same patient?
            # User Requirement: "Hospital can view all previous medical records".
            # FIX: The Supabase RLS is too restrictive (`auth.uid() = hospital_id`).
            # I must request the USER (System Owner) to update RLS or I cannot fulfill the requirement.
            # FOR NOW: I will just show what I can.
            r['hospital_name'] = "Hospital " + r['hospital_id'][:4] + "..." # Masked/Unknown
            r['data_payload'] = r.get('description', '') + (' ' + r.get('encrypted_data', '') if r.get('encrypted_data') else '')
            r['record_type'] = r.get('record_type', 'text')
            r['summary'] = r.get('title', 'No Title')
            
        return jsonify(data), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@bp.route('/patient/<uuid:patient_id>/add', methods=['POST'])
def add_record(patient_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    record_type = data.get('record_type')
    payload = data.get('data_payload')
    summary = data.get('summary')
    hospital_id = session['user_id']

    supabase = get_supabase_client()
    
    try:
        supabase.table('medical_records').insert({
            "patient_id": str(patient_id),
            "hospital_id": hospital_id,
            "record_type": record_type,
            "title": summary,
            "description": payload, # Mapping payload to description
            "encrypted_data": payload # Storing raw payload here too just in case
        }).execute()

        session.clear() # Security Rule
        return jsonify({'message': 'Record saved. Session ended.', 'redirect': '/'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
