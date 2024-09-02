
post  http://localhost:3000/api/newjudicial-authorities
get  http://localhost:3000/api/alljudicial-authorities
get  http://localhost:3000/api/judicial-authorities/:id
put  http://localhost:3000/api/updatejudicial-authorities/:id
delete  http://localhost:3000/api/deletejudicial-authorities/:id




{
    "judgeId": "J12345",
    "personalInfo": {
        "name": "John Doe",
        "courtName": "High Court",
        "contactInfo": {
            "phone": "+1234567890",
            "email": "john.doe@example.com"
        }
    },
    "bailApplications": [
        {
            "applicationId": "64f0b5e8f91b4d1e1e69c8d4",
            "evaluation": "Reviewed and considered",
            "riskFactors": ["Flight risk", "Previous offenses"],
            "decision": {
                "result": "Pending",
                "date": "2024-09-01T00:00:00Z"
            },
            "conditions": ["Must report to local authorities"]
        }
    ],
    "documents": {
        "courtProceedings": ["court_proceeding_001.pdf"],
        "riskAssessmentReports": ["risk_assessment_001.pdf"],
        "legalOpinions": ["legal_opinion_001.pdf"]
    }
}



{
    "judgeId": "J12345",
    "personalInfo": {
        "name": "John Doe",
        "courtName": "High Court",
        "contactInfo": {
            "phone": "+1234567890",
            "email": "john.doe@example.com"
        }
    },
    "bailApplications": [
        {
            "applicationId": "64f0b5e8f91b4d1e1e69c8d4",
            "evaluation": "Reviewed and considered",
            "riskFactors": ["Flight risk", "Previous offenses"],
            "decision": {
                "result": "Pending",
                "date": "2024-09-01T00:00:00Z"  
            },
            "conditions": ["Must report to local authorities"]
        }
    ],
    "documents": {
        "courtProceedings": ["court_proceeding_001.pdf"],
        "riskAssessmentReports": ["risk_assessment_001.pdf"],
        "legalOpinions": ["legal_opinion_001.pdf"]
    }
}
