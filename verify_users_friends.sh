#!/bin/bash

# Function to make request and check status
# Function to make request and check status
make_request() {
  local url=$1
  local method=$2
  local token=$3
  local data=$4
  
  if [ -n "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json")
  fi
  
  http_code=$(tail -n1 <<< "$response")
  body=$(sed '$d' <<< "$response")
  
  # Print to stderr so it doesn't interfere with capturing stdout
  echo "Request: $method $url" >&2
  echo "HTTP Code: $http_code" >&2
  echo "Body: $body" >&2
  
  if [ "$http_code" -ge 400 ]; then
    echo "Request failed!" >&2
    exit 1
  fi
  
  echo "$body"
}

# Generate unique timestamp
TS=$(date +%s)
OWNER_EMAIL="owner_${TS}@turf.com"
FRIEND_EMAIL="friend_${TS}@turf.com"

# 1. Register Owner
echo "Registering Owner..."
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Owner User\",\"email\":\"$OWNER_EMAIL\",\"password\":\"password123\",\"phone\":\"1234567890\",\"role\":\"OWNER\"}"

# Login as Owner
echo "Logging in as Owner..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$OWNER_EMAIL\",\"password\":\"password123\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.id')

if [ "$TOKEN" == "null" ]; then
  echo "Login failed: $LOGIN_RESPONSE"
  exit 1
fi
echo "Owner logged in. ID: $USER_ID"

# 2. Register a second user (Friend)
echo "Registering Friend User..."
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Friend User\",\"email\":\"$FRIEND_EMAIL\",\"password\":\"password123\",\"phone\":\"9876543210\",\"role\":\"USER\"}"

# Login as Friend
echo "Logging in as Friend..."
FRIEND_LOGIN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$FRIEND_EMAIL\",\"password\":\"password123\"}")

FRIEND_TOKEN=$(echo $FRIEND_LOGIN | jq -r '.token')
FRIEND_ID=$(echo $FRIEND_LOGIN | jq -r '.id')
echo "Friend logged in. ID: $FRIEND_ID"

# 3. Search User (Owner searches for Friend)
echo "Searching for 'Friend'..."
make_request "http://localhost:8080/api/users/search?query=Friend" "GET" "$TOKEN" ""

# 4. Send Friend Request (Owner -> Friend)
echo "Sending Friend Request..."
make_request "http://localhost:8080/api/friends/invite" "POST" "$TOKEN" "{\"email\":\"$FRIEND_EMAIL\"}"

# 5. List Pending Requests (Friend checks)
echo "Checking Pending Requests for Friend..."
PENDING_RES=$(make_request "http://localhost:8080/api/friends/requests" "GET" "$FRIEND_TOKEN" "")

REQUEST_ID=$(echo $PENDING_RES | jq -r '.[0].id')

if [ "$REQUEST_ID" == "null" ]; then
  echo "No pending request found!"
  exit 1
fi

# 6. Accept Request (Friend accepts)
echo "Accepting Request ID $REQUEST_ID..."
make_request "http://localhost:8080/api/friends/$REQUEST_ID/accept" "POST" "$FRIEND_TOKEN" ""

# 7. List Friends (Owner checks)
echo "Checking Owner's Friends..."
make_request "http://localhost:8080/api/friends/list" "GET" "$TOKEN" ""
