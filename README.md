# University Research Opportunity Portal - Backend (NestJS + MongoDB)

A REST API backend built for the University Research Opportunity Portal assignment using NestJS, TypeScript, MongoDB, and Mongoose.

## 📋 Technology Stack & Features

- **Framework**: NestJS (TypeScript)
- **Database & ODM**: MongoDB & Mongoose
- **Global Route Prefix**: `/api`
- **CORS**: Configured using `FRONTEND_ORIGIN` environment variable (defaults to `http://localhost:3000`)
- **Configuration**: `@nestjs/config` reading `MONGODB_URI` from `.env`
- **Validation**: `class-validator` & `class-transformer` with strict whitelist and descriptive HTTP 400 responses
- **Error Handling**: Global exception filter (`AllExceptionsFilter`) producing standardized HTTP 400, 404, and 500 JSON responses
- **Logging**: HTTP middleware logging request methods, paths, status codes, and durations

---

## 📑 Research Opportunity Model

Each opportunity consists of the following fields:

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Title of the research opportunity (*required*) |
| `description` | `string` | Detailed description of the project (*required*) |
| `researchArea` | `string` | Research domain/field (*required*) |
| `facultyMemberName` | `string` | Supervising faculty member (*required*) |
| `department` | `string` | Academic department (*required*) |
| `requiredSkills` | `string[]` | Array of required skills/technologies (*required*) |
| `numberOfPositions` | `number` | Positive integer $\ge 1$ (*required*) |
| `applicationDeadline` | `Date` | Valid ISO date string (*required*) |
| `status` | `enum` | `"Open"` or `"Closed"` (default: `"Open"`) |

---

## 📡 REST API Endpoints

All endpoints are prefixed under `/api`:

### 1. Create an Opportunity
- **Endpoint**: `POST /api/opportunities`
- **Status**: `201 Created`
- **Body**:
```json
{
  "title": "Quantum Computing and Error Mitigation",
  "description": "Research on quantum algorithms and error mitigation for NISQ devices.",
  "researchArea": "Quantum Information Science",
  "facultyMemberName": "Dr. Richard Feynman",
  "department": "Physics",
  "requiredSkills": ["Linear Algebra", "Python", "Qiskit"],
  "numberOfPositions": 2,
  "applicationDeadline": "2026-12-15T23:59:59.000Z",
  "status": "Open"
}
```
- **Validation**: Returns `400 Bad Request` if required fields are missing, `numberOfPositions < 1`, `applicationDeadline` is invalid, or unknown fields are sent.

### 2. List All Opportunities
- **Endpoint**: `GET /api/opportunities`
- **Status**: `200 OK`
- **Query Filters (Optional)**:
  - `?status=Open` or `?status=Closed`
  - `?department=Physics`
  - `?researchArea=Quantum`

### 3. Get Opportunity by ID
- **Endpoint**: `GET /api/opportunities/:id`
- **Status**: `200 OK`
- **Not Found**: Returns `404 Not Found` if ID does not exist or has been deleted.
- **Invalid ID**: Returns `400 Bad Request` if ID is not a valid 24-character hexadecimal MongoDB ObjectId.

### 4. Update Opportunity (including marking as Closed)
- **Endpoint**: `PUT /api/opportunities/:id`
- **Status**: `200 OK`
- **Body**:
```json
{
  "status": "Closed",
  "numberOfPositions": 1
}
```
- **Not Found**: Returns `404 Not Found` if ID does not exist.

### 5. Delete Opportunity
- **Endpoint**: `DELETE /api/opportunities/:id`
- **Status**: `200 OK`
- **Post-Delete Behavior**: Any subsequent `GET` or `DELETE` with the deleted ID returns `404 Not Found`.

---

## 📂 Project Structure

```
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── .env                    # Environment file (ignored by Git)
│   ├── .env.example            # Placeholder environment template
│   ├── src/
│   │   ├── common/
│   │   │   ├── filters/        # Global exception filter (AllExceptionsFilter)
│   │   │   ├── middleware/     # Logger middleware
│   │   │   └── pipes/          # ParseObjectIdPipe for ObjectId validation
│   │   ├── opportunities/
│   │   │   ├── dto/            # CreateOpportunityDto, UpdateOpportunityDto, QueryOpportunityDto
│   │   │   ├── enums/          # OpportunityStatus (Open, Closed)
│   │   │   ├── schemas/        # Opportunity Mongoose Schema
│   │   │   ├── opportunities.controller.ts
│   │   │   ├── opportunities.service.ts
│   │   │   └── opportunities.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── test/
│       ├── opportunities.e2e-spec.ts
│       └── jest-e2e.json
└── postman/
    └── Opportunities_API.postman_collection.json
```

---

## 🚀 Setup & Execution Guide

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```
Default `.env` configuration:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/research_opportunity_db
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Start the NestJS Backend
Development mode:
```bash
cd backend
npm run start:dev
```
Production build:
```bash
cd backend
npm run build
npm run start:prod
```
The API will be accessible at `http://localhost:5000/api`.

---

## 🧪 Running Tests
Unit tests:
```bash
cd backend
npm test
```
End-to-end tests:
```bash
cd backend
npm run test:e2e
```

---

## 📬 Postman Collection
Import [`postman/Opportunities_API.postman_collection.json`](postman/Opportunities_API.postman_collection.json) into Postman to test all endpoints.
