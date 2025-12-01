import urllib.request
import urllib.error
import json
import sys
import time

BASE_URL = "http://localhost:8080/api"

def request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    if data:
        data = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status >= 200 and response.status < 300:
                response_data = response.read().decode('utf-8')
                if response_data:
                    return json.loads(response_data)
                return {}
            else:
                print(f"Error: {response.status} - {response.reason}")
                return None
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def run_tests():
    print("--- Starting API Tests ---")
    
    # 1. Register User
    print("\n1. Registering User...")
    user_email = f"testuser_{int(time.time())}@example.com"
    user_data = {
        "name": "Test User",
        "email": user_email,
        "password": "password123",
        "phone": "1234567890",
        "role": "USER"
    }
    # Note: If user already exists, this might fail, so we handle it.
    # But with unique email timestamp, it should be fine.
    res = request("POST", "/auth/register", user_data)
    if not res:
        # Try login if register fails (maybe already exists)
        print("Registration failed (maybe exists), trying login...")
    
    # 2. Login User
    print("\n2. Logging in User...")
    login_data = {
        "email": user_email,
        "password": "password123"
    }
    login_res = request("POST", "/auth/login", login_data)
    if not login_res or 'token' not in login_res:
        print("Login failed!")
        return
    
    user_token = login_res['token']
    user_id = login_res['id']
    print(f"User logged in. ID: {user_id}")
    
    # 3. Get Turfs
    print("\n3. Fetching Turfs...")
    turfs = request("GET", "/turfs", token=user_token)
    if not turfs:
        print("No turfs found or error fetching turfs.")
        # If no turfs, we can't test booking.
        # We might need to create one as owner first.
    else:
        print(f"Found {len(turfs)} turfs.")
        turf_id = turfs[0]['id']
        print(f"Using Turf ID: {turf_id}")
        
        # 4. Get Slots
        print("\n4. Fetching Slots...")
        today = time.strftime("%Y-%m-%d")
        slots = request("GET", f"/turfs/{turf_id}/slots?date={today}", token=user_token)
        
        if slots and len(slots) > 0:
            print(f"Found {len(slots)} slots.")
            # Find an available slot
            available_slot = next((s for s in slots if s['isAvailable']), None)
            
            if available_slot:
                print(f"Found available slot ID: {available_slot['id']}")
                
                # 5. Initiate Booking
                print("\n5. Initiating Booking...")
                booking_data = {
                    "userId": user_id,
                    "turfId": turf_id,
                    "slotId": available_slot['id'],
                    "totalAmount": available_slot.get('customPrice', 1000)
                }
                booking = request("POST", "/bookings/initiate", booking_data, token=user_token)
                
                if booking:
                    print(f"Booking initiated successfully! Booking ID: {booking['id']}, Status: {booking['status']}")
                else:
                    print("Booking initiation failed.")
            else:
                print("No available slots found for today.")
        else:
            print("No slots found for today.")

    # 6. Owner Flow
    print("\n--- Testing Owner Flow ---")
    owner_email = f"owner_{int(time.time())}@example.com"
    owner_data = {
        "name": "Test Owner",
        "email": owner_email,
        "password": "password123",
        "phone": "9876543210",
        "role": "OWNER"
    }
    print("\n6. Registering Owner...")
    request("POST", "/auth/register", owner_data)
    
    print("\n7. Logging in Owner...")
    owner_login = request("POST", "/auth/login", {"email": owner_email, "password": "password123"})
    
    if owner_login and 'token' in owner_login:
        owner_token = owner_login['token']
        owner_id = owner_login['id']
        print(f"Owner logged in. ID: {owner_id}")
        
        # Create a Turf for this owner
        print("\n8. Creating Turf...")
        turf_data = {
            "name": "Owner's Turf",
            "location": "Test Location",
            "description": "Best turf",
            "basePrice": 1200,
            "sports": ["Cricket", "Football"]
        }
        # Assuming there is an endpoint to create turf. 
        # Looking at OwnerService in api.ts: addTurf: (data) => api.post('/owner/turfs', data)
        new_turf = request("POST", "/owner/turfs", turf_data, token=owner_token)
        
        if new_turf:
            print(f"Turf created. ID: {new_turf['id']}")
            new_turf_id = new_turf['id']
            
            # Generate Slots
            print("\n9. Generating Slots...")
            today_date = time.strftime("%Y-%m-%d")
            # Endpoint: /api/turfs/{turfId}/slots/generate?date=...&startTime=...
            # Note: It uses @RequestParam, so we pass them in URL
            gen_url = f"/turfs/{new_turf_id}/slots/generate?date={today_date}&startTime=10:00&endTime=12:00&pricePerSlot=1200"
            
            request("POST", gen_url, token=owner_token)
            
            # Fetch slots to confirm
            slots = request("GET", f"/turfs/{new_turf_id}/slots?date={today_date}", token=owner_token)
            if slots:
                print(f"Slots generated: {len(slots)}")
                target_slot = slots[0]
                
                # Owner Walk-in Booking
                print("\n10. Owner Walk-in Booking...")
                walkin_data = {
                    "turfId": new_turf_id,
                    "slotId": target_slot['id'],
                    "customerName": "Walk-in Customer",
                    "customerPhone": "5555555555"
                }
                # OwnerBookings.tsx: api.post('/bookings/owner/book', ...)
                booking = request("POST", "/bookings/owner/book", walkin_data, token=owner_token)
                
                if booking:
                    print(f"Walk-in booking successful! ID: {booking['id']}, Status: {booking['status']}")
                else:
                    print("Walk-in booking failed.")
        else:
            print("Failed to create turf.")
            
    print("\n--- Tests Completed ---")

if __name__ == "__main__":
    run_tests()
