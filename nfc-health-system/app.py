from flask import Flask, render_template, g, request, redirect, url_for, session
from dotenv import load_dotenv
import api
import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-dev-key')

# Register API Blueprint
app.register_blueprint(api.bp)

# UI Routes
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('dashboard.html')

@app.route('/hospital/profile')
def hospital_profile():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('profile.html')

@app.route('/patient/access')
def patient_access():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('patient_access.html')

@app.route('/patient/<uuid:patient_id>/view')
def patient_view(patient_id):
    """View patient records. Takes UUID now."""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    # We pass the ID to the template. The template JS fetches details via API.
    # We can fetch basic Name info here if we want, but better to let API handle it consistency
    # Hack: Pass a dummy object so template {{ patient.id }} works.
    # Actually, let's fetch the name to be nice.
    from supabase_client import get_supabase_client
    supabase = get_supabase_client()
    try:
        # Get Profile for Name
        prof = supabase.table('profiles').select('full_name').eq('id', str(patient_id)).execute()
        full_name = prof.data[0]['full_name'] if prof.data else "Unknown Patient"
    except:
        full_name = "Loading..."

    patient = {'id': str(patient_id), 'full_name': full_name}
    return render_template('patient_view.html', patient=patient)

@app.route('/patient/<uuid:patient_id>/add')
def add_medical_data(patient_id):
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('add_medical_data.html', patient_id=patient_id)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
