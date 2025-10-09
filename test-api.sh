#!/bin/bash

# WorkLab API Test Script
# This script tests all major API endpoints

BASE_URL="http://localhost:3000"
FREELANCER_EMAIL="freelancer@example.com"
CLIENT_EMAIL="client@example.com"
AGENCY_EMAIL="agency@example.com"
PASSWORD="password123"

echo "🚀 Starting WorkLab API Tests..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    local description=$5
    
    echo -e "${YELLOW}Testing: $description${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" -H "Content-Type: application/json" $headers -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" $headers)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        print_status "$description - HTTP $http_code" 0
        echo "Response: $body" | head -c 200
        echo "..."
    else
        print_status "$description - HTTP $http_code" 1
        echo "Error: $body"
    fi
    echo ""
}

# Test 1: Health Check
test_endpoint "GET" "$BASE_URL/health" "" "" "Health Check"

# Test 2: API Root
test_endpoint "GET" "$BASE_URL/" "" "" "API Root"

# Test 3: Register Freelancer
FREELANCER_DATA='{
  "email": "'$FREELANCER_EMAIL'",
  "password": "'$PASSWORD'",
  "firstName": "John",
  "lastName": "Freelancer",
  "userType": "freelancer"
}'
test_endpoint "POST" "$BASE_URL/api/auth/register" "$FREELANCER_DATA" "" "Register Freelancer"

# Test 4: Register Client
CLIENT_DATA='{
  "email": "'$CLIENT_EMAIL'",
  "password": "'$PASSWORD'",
  "firstName": "Jane",
  "lastName": "Client",
  "userType": "client"
}'
test_endpoint "POST" "$BASE_URL/api/auth/register" "$CLIENT_DATA" "" "Register Client"

# Test 5: Register Agency
AGENCY_DATA='{
  "email": "'$AGENCY_EMAIL'",
  "password": "'$PASSWORD'",
  "firstName": "Tech",
  "lastName": "Solutions",
  "userType": "agency"
}'
test_endpoint "POST" "$BASE_URL/api/auth/register" "$AGENCY_DATA" "" "Register Agency"

# Test 6: Login Freelancer
LOGIN_DATA='{
  "email": "'$FREELANCER_EMAIL'",
  "password": "'$PASSWORD'"
}'
FREELANCER_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d "$LOGIN_DATA")
FREELANCER_TOKEN=$(echo "$FREELANCER_LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
test_endpoint "POST" "$BASE_URL/api/auth/login" "$LOGIN_DATA" "" "Login Freelancer"

# Test 7: Login Client
CLIENT_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"'$CLIENT_EMAIL'","password":"'$PASSWORD'"}')
CLIENT_TOKEN=$(echo "$CLIENT_LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
test_endpoint "POST" "$BASE_URL/api/auth/login" '{"email":"'$CLIENT_EMAIL'","password":"'$PASSWORD'"}' "" "Login Client"

# Test 8: Create Job Post (Client)
JOB_DATA='{
  "title": "Build a React Website",
  "description": "I need a professional website built with React and Node.js",
  "budget": 1500,
  "budgetType": "fixed",
  "skills": ["react", "javascript", "node.js"],
  "experienceLevel": "intermediate",
  "projectDuration": "2-4 weeks",
  "connectRequired": 2
}'
test_endpoint "POST" "$BASE_URL/api/client/jobs" "$JOB_DATA" "-H 'Authorization: Bearer $CLIENT_TOKEN'" "Create Job Post"

# Test 9: Update Job to Active
test_endpoint "PUT" "$BASE_URL/api/jobs/1" '{"status":"active"}' "-H 'Authorization: Bearer $CLIENT_TOKEN'" "Update Job Status"

# Test 10: Search Jobs (Public)
test_endpoint "GET" "$BASE_URL/api/jobs?search=react&limit=5" "" "" "Search Jobs (Public)"

# Test 11: Search Jobs (Freelancer)
test_endpoint "GET" "$BASE_URL/api/freelancer/jobs/search?searchTerm=react&limit=5" "" "-H 'Authorization: Bearer $FREELANCER_TOKEN'" "Search Jobs (Freelancer)"

# Test 12: Get Job Details
test_endpoint "GET" "$BASE_URL/api/jobs/1" "" "" "Get Job Details"

# Test 13: Apply to Job
APPLICATION_DATA='{
  "jobPostId": 1,
  "coverLetter": "I am very interested in this React project. I have 5 years of experience in React development.",
  "proposedRate": 25.00,
  "proposedTimeline": "2 weeks"
}'
test_endpoint "POST" "$BASE_URL/api/job-applications/apply" "$APPLICATION_DATA" "-H 'Authorization: Bearer $FREELANCER_TOKEN'" "Apply to Job"

# Test 14: Get Job Applications (Client)
test_endpoint "GET" "$BASE_URL/api/client/jobs/1/applications" "" "-H 'Authorization: Bearer $CLIENT_TOKEN'" "Get Job Applications"

# Test 15: Search Freelancers
test_endpoint "GET" "$BASE_URL/api/client/freelancers/search?searchTerm=react&limit=5" "" "-H 'Authorization: Bearer $CLIENT_TOKEN'" "Search Freelancers"

# Test 16: Get Connect Balance
test_endpoint "GET" "$BASE_URL/api/freelancer/connects" "" "-H 'Authorization: Bearer $FREELANCER_TOKEN'" "Get Connect Balance"

# Test 17: Get My Applications
test_endpoint "GET" "$BASE_URL/api/freelancer/applications" "" "-H 'Authorization: Bearer $FREELANCER_TOKEN'" "Get My Applications"

# Test 18: Get My Job Posts
test_endpoint "GET" "$BASE_URL/api/client/jobs" "" "-H 'Authorization: Bearer $CLIENT_TOKEN'" "Get My Job Posts"

# Test 19: Get Featured Jobs
test_endpoint "GET" "$BASE_URL/api/jobs/featured?limit=5" "" "" "Get Featured Jobs"

# Test 20: Get Urgent Jobs
test_endpoint "GET" "$BASE_URL/api/jobs/urgent?limit=5" "" "" "Get Urgent Jobs"

echo "=================================="
echo "🎉 API Testing Complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Open Swagger UI: http://localhost:3000/api-docs"
echo "2. Import Postman Collection: WorkLab_API.postman_collection.json"
echo "3. Check API Testing Guide: API_TESTING_GUIDE.md"
echo ""
echo "🔑 Test Tokens:"
echo "Freelancer Token: $FREELANCER_TOKEN"
echo "Client Token: $CLIENT_TOKEN"
