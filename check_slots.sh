#!/bin/bash

# Login as User (to get token)
echo "Logging in as User..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"friend@turf.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ]; then
  echo "Login failed (using owner fallback): $LOGIN_RESPONSE"
  # Fallback to owner if friend doesn't exist (from previous runs)
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"owner@turf.com","password":"owner123"}')
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
fi

echo "Token: ${TOKEN:0:10}..."

# Check Slots for Turf 1 on 2025-12-01 (Date used in verify_auth.sh)
echo "Checking slots for Turf 1 on 2025-12-01..."
curl -v -X GET "http://localhost:8080/api/turfs/1/slots?date=2025-12-01" \
  -H "Authorization: Bearer $TOKEN"
