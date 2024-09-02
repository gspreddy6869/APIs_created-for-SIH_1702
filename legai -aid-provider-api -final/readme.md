API Endpoints without cloudinary:

POST http://localhost:3000/api/newlegal-aid-providers     Creates a new legal aid provider.
GET http://localhost:3000//api/legal-aid-providers        Retrieves all legal aid providers.
GET http://localhost:3000//api/legal-aid-providers/:id      Retrieves a specific legal aid provider by ID.
PUT http://localhost:3000//api/legal-aid-providers/:id      Updates an existing legal aid provider.
DELETE http://localhost:3000//api/legal-aid-providers/:id       Deletes a legal aid provider by ID.
POST http://localhost:3000//api/legal-aid-providers/:id/applications     Adds a new bail application to a specific legal aid provider's records.

API Endpoints with cloudinary
POST http://localhost:3000/api/newlegal-aid-providers     Creates a new legal aid provider.
GET http://localhost:3000//api/alllegal-aid-providers        Retrieves all legal aid providers.
GET http://localhost:3000/api/legal-aid-providersbyid/:id      Retrieves a specific legal aid provider by ID.
PUT http://localhost:3000/api/updatelegal-aid-providers/:id      Updates an existing legal aid provider.
DELETE http://localhost:3000/api/deletelegal-aid-providers/:id     Deletes a legal aid provider by ID.
POST http://localhost:3000/api/bail-application/:id     Adds a new bail application to a specific legal aid provider's records.
post http://localhost:3000/api/documents/:id/      Adds documents 