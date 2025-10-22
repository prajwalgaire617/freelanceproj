# Quick Reference Guide - Job Posting & Application System

## For Agencies

### 1. Post a Job
```http
POST /api/jobs
Authorization: Bearer {agency_token}
Content-Type: application/json

{
  "title": "Full Stack Developer Needed",
  "description": "Looking for an experienced developer...",
  "budget": 5000,
  "budgetType": "fixed",
  "skills": ["React", "Node.js", "MongoDB"],
  "experienceLevel": "expert",
  "projectDuration": "2-3 months",
  "status": "active"
}
```
**Note**: Agency-posted jobs automatically set `hireType: 'freelancer'`

---

### 2. Search Freelancers
```http
GET /api/agencies/freelancers/search?searchTerm=developer&skills=React&page=1&limit=10
Authorization: Bearer {agency_token}
```

**Query Parameters:**
- `searchTerm` - Search by name, expertise, or bio
- `skills` - Filter by skills (array)
- `hourlyRateMin` - Minimum hourly rate
- `hourlyRateMax` - Maximum hourly rate
- `location` - Filter by city/country
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

---

### 3. View Freelancer Profile
```http
GET /api/agencies/freelancers/:freelancerId
Authorization: Bearer {agency_token}
```

---

### 4. View My Posted Jobs
```http
GET /api/jobs/my-jobs?status=active&page=1&limit=10
Authorization: Bearer {agency_token}
```

---

## For Clients

### 1. Post a Job with HireType
```http
POST /api/jobs
Authorization: Bearer {client_token}
Content-Type: application/json

{
  "title": "Marketing Campaign Manager",
  "description": "Need help with digital marketing...",
  "budget": 3000,
  "budgetType": "fixed",
  "hireType": "both",
  "skills": ["Marketing", "SEO", "Social Media"],
  "experienceLevel": "intermediate",
  "status": "active"
}
```

**HireType Options:**
- `"freelancer"` - Only freelancers can apply
- `"agency"` - Only agencies can apply
- `"both"` - Both freelancers and agencies can apply (default)

---

### 2. Search Freelancers
```http
GET /api/client/freelancers/search?searchTerm=designer&page=1&limit=10
Authorization: Bearer {client_token}
```

---

### 3. Initiate Conversation with Applicant
```http
POST /api/messages
Authorization: Bearer {client_token}
Content-Type: application/json

{
  "receiverId": 123,
  "content": "Hi! I reviewed your application and would like to discuss further.",
  "jobApplicationId": 456,
  "messageType": "text"
}
```
**Note**: Only the job poster can send the first message!

---

## For Freelancers

### 1. Search Jobs
```http
GET /api/jobs/search?q=developer&experienceLevel=intermediate
Authorization: Bearer {freelancer_token}
```

---

### 2. Apply for Job
```http
POST /api/job-applications
Authorization: Bearer {freelancer_token}
Content-Type: application/json

{
  "jobPostId": 789,
  "coverLetter": "I am interested in this position...",
  "proposedRate": 50,
  "proposedTimeline": "2 weeks"
}
```

**Validation**:
- Job's `hireType` must allow freelancers
- Cannot apply to jobs posted by agencies
- Cannot apply if already applied (unless withdrawn)

---

### 3. View My Applications
```http
GET /api/job-applications/my-applications?status=pending&page=1
Authorization: Bearer {freelancer_token}
```

---

## Common Scenarios

### Scenario 1: Agency Hiring a Freelancer
1. Agency posts job → `hireType` auto-set to `'freelancer'`
2. Freelancer applies to agency job ✅
3. Agency reviews applications
4. Agency sends first message to freelancer
5. Freelancer can reply
6. Agency sends contract

### Scenario 2: Client Hiring Agency
1. Client posts job with `hireType: 'agency'`
2. Agency applies to client job ✅
3. Client reviews applications
4. Client sends first message to agency
5. Agency can reply
6. Client sends contract

### Scenario 3: Client Hiring Either
1. Client posts job with `hireType: 'both'`
2. Both freelancers and agencies can apply ✅
3. Client reviews all applications
4. Client chooses best fit
5. Client initiates conversation
6. Client sends contract to chosen applicant

---

## Error Responses

### 403 - HireType Mismatch
```json
{
  "error": "This job is only open to freelancers",
  "message": "The job poster is only accepting applications from freelancers"
}
```

### 403 - Agency-to-Agency Restriction
```json
{
  "error": "Agencies cannot apply to other agency job posts",
  "message": "Agencies can only apply to client job posts"
}
```

### 403 - Poster-First Messaging
```json
{
  "error": "Only the job poster can initiate conversation with applicants",
  "message": "Please wait for the job poster to contact you first"
}
```

---

## Best Practices

### For Job Posters (Clients & Agencies)
1. ✅ Set appropriate `hireType` based on your needs
2. ✅ Review applications promptly
3. ✅ Initiate conversations with promising applicants
4. ✅ Send contracts after reaching agreement
5. ❌ Don't post duplicate jobs
6. ❌ Don't spam applicants

### For Applicants (Freelancers & Agencies)
1. ✅ Check job requirements before applying
2. ✅ Write personalized cover letters
3. ✅ Wait for poster to contact you first
4. ✅ Respond promptly to messages
5. ❌ Don't apply to incompatible jobs
6. ❌ Don't spam job posters

---

## Permissions Matrix

| Action | Freelancer | Agency | Client |
|--------|------------|--------|--------|
| Post Job | ❌ | ✅ (hireType: freelancer) | ✅ (any hireType) |
| Apply to Client Job | ✅ (if allowed) | ✅ (if allowed) | ❌ |
| Apply to Agency Job | ✅ | ❌ | ❌ |
| Search Freelancers | ❌ | ✅ | ✅ |
| Search Jobs | ✅ | ❌ | ❌ |
| Send First Message | ❌ (applicant) | ❌ (applicant) | ✅ (poster) |
| Reply to Message | ✅ | ✅ | ✅ |
| Send Contract | ❌ | ✅ (poster) | ✅ (poster) |
| Accept Contract | ✅ | ✅ | ❌ |

---

## Migration Instructions

If you already have existing job posts without `hireType`:
1. Run migration: `npm run db:migrate`
2. All existing jobs will default to `hireType: 'both'`
3. Clients can update their jobs to set specific hireType if needed

```http
PUT /api/jobs/:jobId
Authorization: Bearer {token}
Content-Type: application/json

{
  "hireType": "freelancer"
}
```

---

## Support & Troubleshooting

### Issue: "Cannot apply to this job"
**Solution**: Check the job's `hireType` - it may be restricted to a specific applicant type.

### Issue: "Cannot send message"
**Solution**: If you're an applicant, wait for the job poster to contact you first.

### Issue: "Agency cannot post jobs"
**Solution**: Ensure your user account has `userType: 'agency'` and you're using the correct authentication token.

---

**Last Updated**: October 22, 2025
**API Version**: 1.0.0
