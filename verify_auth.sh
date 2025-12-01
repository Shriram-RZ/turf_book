#!/bin/bash

# 1. Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@turf.com","password":"owner123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.id')

if [ "$TOKEN" == "null" ]; then
  echo "Login failed: $LOGIN_RESPONSE"
  exit 1
fi

echo "Login successful. Token: ${TOKEN:0:10}..."

# 2. Generate Slots (Fix Verification)
# Need a turf ID. Assuming 1 exists or I need to create one.
# Let's try to create a turf first just in case.
echo "Creating Turf..."
TURF_RESPONSE=$(curl -s -X POST http://localhost:8080/api/owner/turfs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Turf","location":"Test Location","description":"Test Description","pricePerHour":1000,"images":[]}')

# If turf creation fails (maybe endpoint not ready or whatever), we might need to skip or use existing.
# But let's assume it works or we use ID 1.
TURF_ID=1

echo "Generating Slots for Turf $TURF_ID..."
GENERATE_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/gen_response.json -X POST "http://localhost:8080/api/turfs/$TURF_ID/slots/generate?date=2025-12-01&startTime=10:00&endTime=12:00&slotDurationMinutes=60&pricePerSlot=500" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(tail -n1 <<< "$GENERATE_RESPONSE")

if [ "$HTTP_CODE" == "200" ]; then
  echo "Generate Slots successful."
else
  echo "Generate Slots failed with code $HTTP_CODE"
  cat /tmp/gen_response.json
fi

# 3. Refresh Token
echo "Testing Refresh Token..."
REFRESH_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"some-refresh-token"}')

echo "Refresh Response: $REFRESH_RESPONSE"

# 4. Forgot Password
echo "Testing Forgot Password..."
FORGOT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@turf.com"}')

echo "Forgot Password Response: $FORGOT_RESPONSE"

# 5. Reset Password
echo "Testing Reset Password..."
RESET_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"some-token","newPassword":"newpassword123"}')

echo "Reset Password Response: $RESET_RESPONSE"
