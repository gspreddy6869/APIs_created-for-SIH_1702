get  http://localhost:3000/api/allprisons
post http://localhost:3000/api/newprison
get  http://localhost:3000/api/prison/:id
put  http://localhost:3000/api/updateprison/:id
delete http://localhost:3000/api/deleteprison/:id




{
    "authorityId": "PA001",
    "prisonName": "Central City Prison",
    "contactInfo": {
      "phone": "+1234567890",
      "email": "centralcityprison@example.com"
    },
    "prisonerData": [
      {
        "prisonerId": "6502f0df5a523c620fcd1234",
        "incarcerationReport": "Incarcerated for 5 years for theft.",
        "behaviorReports": ["Good behavior in the first year", "No incidents in the second year"],
        "medicalRecords": ["Treated for a minor cold in 2022", "No major health issues"],
        "disciplinaryRecords": ["One warning for minor misconduct in 2023"]
      }
    ],
    "releaseAuthorizations": [
      {
        "prisonerId": "6502f0df5a523c620fcd1234",
        "releaseDate": "2025-07-15T00:00:00.000Z",
        "conditions": ["Regular check-ins", "Cannot leave the city without permission"]
      }
    ]
  }'
