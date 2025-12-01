#!/bin/bash

# Concurrency Test Script
# Simulates 2 users trying to book the same slot simultaneously

URL="http://localhost:8080/api/bookings/initiate"
SLOT_ID=1
TURF_ID=1
AMOUNT=1000

# User 1 Request
curl -X POST $URL \
  -H "Content-Type: application/json" \
  -d "{\"userId\": 1, \"turfId\": $TURF_ID, \"slotId\": $SLOT_ID, \"totalAmount\": $AMOUNT}" &

# User 2 Request
curl -X POST $URL \
  -H "Content-Type: application/json" \
  -d "{\"userId\": 2, \"turfId\": $TURF_ID, \"slotId\": $SLOT_ID, \"totalAmount\": $AMOUNT}" &

wait
echo "Concurrency Test Completed"
