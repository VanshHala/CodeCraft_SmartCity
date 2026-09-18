#!/bin/bash
# 1. Register users
curl -s -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"name": "Citizen1", "email": "cit1@test.com", "password": "pass", "role": "CITIZEN"}'
curl -s -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"name": "Worker1", "email": "work1@test.com", "password": "pass", "role": "WORKER"}'
curl -s -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"name": "Auth1", "email": "auth1@test.com", "password": "pass", "role": "AUTHORITY"}'

# 2. Login
CIT_TOKEN=$(curl -s -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"email": "cit1@test.com", "password": "pass"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
WORK_TOKEN=$(curl -s -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"email": "work1@test.com", "password": "pass"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
AUTH_TOKEN=$(curl -s -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"email": "auth1@test.com", "password": "pass"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "CIT_TOKEN=$CIT_TOKEN"
echo "WORK_TOKEN=$WORK_TOKEN"
echo "AUTH_TOKEN=$AUTH_TOKEN"

# 3. Test submitting report (Checklist 1)
echo "Submitting report 1"
curl -s -X POST http://localhost:8080/api/reports -H "Content-Type: application/json" -H "Authorization: Bearer $CIT_TOKEN" -d '{"citizenId": 1, "photoUrl": "/test.jpg", "description": "huge pothole", "issueType": "POTHOLE", "lat": 23.03, "lng": 72.58}' > /tmp/report1.json
cat /tmp/report1.json

# 4. Test missing required fields (Checklist 9)
echo "Submitting report with missing fields"
curl -s -X POST http://localhost:8080/api/reports -H "Content-Type: application/json" -H "Authorization: Bearer $CIT_TOKEN" -d '{"citizenId": 1, "description": "huge pothole"}' -w "\nHTTP_STATUS:%{http_code}\n" > /tmp/report_fail.json
cat /tmp/report_fail.json
