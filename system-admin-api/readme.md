post  http://localhost:3000/newsystem-admin
get  http://localhost:3000/allsystem-admins
get  http://localhost:3000/system-adminsbyid/:id
put   http://localhost:3000/Updatesystem-admins/:id
delete  http://localhost:3000/deletesystem-admins/:id


wuth cloudinary

post  http://localhost:3000/newsystem-admin
get http://localhost:3000/allsystem-admins
get  http://localhost:3000/system-adminsbyid/:id
put http://localhost:3000/Updatesystem-admins/:id
delete  http://localhost:3000/deletesystem-admins/:id





{
  "adminId": "admin123",
  "personalInfo": {
    "name": "John Doe",
    "contactInfo": {
      "phone": "+1234567890",
      "email": "john.doe@example.com"
    }
  },
  "tasks": [
    {
      "taskType": "Database",
      "description": "Update the database schema to include new fields for user analytics.",
      "status": "Pending"
    },
    {
      "taskType": "Security",
      "description": "Conduct a security audit of the existing system.",
      "status": "In Progress"
    }
  ],
  "systemDocuments": {
    "architectureDocs": [
      "https://example.com/docs/architecture/v1",
      "https://example.com/docs/architecture/v2"
    ],
    "securityAuditReports": [
      "https://example.com/reports/security/2023"
    ]
  },
  "technicalIssues": [
    {
      "issueDescription": "Intermittent server crashes during peak hours.",
      "reportDate": "2024-09-01T08:30:00Z",
      "resolutionStatus": "Unresolved"
    },
    {
      "issueDescription": "Unauthorized access attempts detected in server logs.",
      "reportDate": "2024-09-02T10:15:00Z",
      "resolutionStatus": "Resolved"
    }
  ]
}
