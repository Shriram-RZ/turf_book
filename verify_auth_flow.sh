#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "--------------------------------------------------"
echo "Verifying Auth Flow (Login -> Access Resource -> Refresh -> Access Resource)"
echo "--------------------------------------------------"

# 0. Register User
echo "0. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User", "email":"testuser@example.com", "password":"password123", "phone":"1234567890", "role":"USER"}')

echo "Registration response: $REGISTER_RESPONSE"

# 1. Login
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com", "password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')

if [ "$TOKEN" == "null" ] || [ "$REFRESH_TOKEN" == "null" ]; then
  echo -e "${RED}Login failed!${NC}"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo -e "${GREEN}Login successful!${NC}"
echo "Access Token: ${TOKEN:0:20}..."
echo "Refresh Token: ${REFRESH_TOKEN:0:20}..."

# 2. Access Protected Resource
echo -e "\n2. Accessing protected resource (/api/users/me)..."
RESOURCE_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/resource_response.json -X GET "$BASE_URL/users/me" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=${RESOURCE_RESPONSE: -3}

if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}Access successful!${NC}"
else
  echo -e "${RED}Access failed with code $HTTP_CODE${NC}"
  cat /tmp/resource_response.json
  exit 1
fi

# 3. Refresh Token
echo -e "\n3. Refreshing token..."
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

NEW_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')
NEW_REFRESH_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.refreshToken')

if [ "$NEW_TOKEN" == "null" ]; then
  echo -e "${RED}Refresh failed!${NC}"
  echo $REFRESH_RESPONSE
  exit 1
fi

echo -e "${GREEN}Refresh successful!${NC}"
echo "New Access Token: ${NEW_TOKEN:0:20}..."

# 4. Access Protected Resource with New Token
echo -e "\n4. Accessing protected resource with NEW token..."
RESOURCE_RESPONSE_2=$(curl -s -w "%{http_code}" -o /tmp/resource_response_2.json -X GET "$BASE_URL/users/me" \
  -H "Authorization: Bearer $NEW_TOKEN")

HTTP_CODE_2=${RESOURCE_RESPONSE_2: -3}

if [ "$HTTP_CODE_2" == "200" ]; then
  echo -e "${GREEN}Access with new token successful!${NC}"
else
  echo -e "${RED}Access with new token failed with code $HTTP_CODE_2${NC}"
  cat /tmp/resource_response_2.json
  exit 1
fi

echo -e "\n${GREEN}Verification Complete! Auth flow is working correctly.${NC}"
