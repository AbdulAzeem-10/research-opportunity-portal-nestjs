# Research Opportunity Portal - Backend (NestJS + MongoDB)

A research opportunity portal backend built with NestJS, TypeScript, MongoDB, and Mongoose, fully documented and tested with Postman and Jest.

## 🛠 Features & Architecture

- **Framework**: NestJS (TypeScript)
- **Database & ODM**: MongoDB & Mongoose
- **Configuration**: `@nestjs/config` supporting environment variables
- **Validation**: `class-validator` and `class-transformer` for strict payload validation and descriptive 400 Bad Request responses
- **Error Handling**: Global exception filter (`AllExceptionsFilter`) producing consistent JSON error structures
- **Logging**: HTTP logger middleware tracking request method, URL, status code, IP, and latency
- **RESTful Endpoints**:
  - `POST   /api/opportunities` (201 Created)
  - `GET    /api/opportunities` (200 OK)
  - `GET    /api/opportunities/:id` (200 OK, 404 Not Found if missing/deleted, 400 if malformed ID)
  - `PUT    /api/opportunities/:id` (200 OK, updates status or details, including marking as **Closed**)
  - `DELETE /api/opportunities/:id` (200 OK, 404 if missing/already deleted)
  - `PATCH  /api/opportunities/:id/close` (200 OK shortcut to mark an opportunity Closed)

---

## 📂 Project Structure

```
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── .env               # (Git ignored)
│   ├── .env.example       # Example environment variables
│   ├── src/
│   │   ├── common/
│   │   │   ├── filters/       # Global exception filters
│   │   │   ├── middleware/    # HTTP logging middleware
│   │   │   └── pipes/         # ParseObjectIdPipe for MongoDB ObjectId validation
│   │   ├── opportunities/
│   │   │   ├── dto/           # CreateOpportunityDto, UpdateOpportunityDto, QueryOpportunityDto
│   │   │   ├── enums/         # OpportunityStatus (Open, In Progress, Closed)
│   │   │   ├── schemas/       # Opportunity Mongoose Schema
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

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 or a MongoDB Atlas connection string

### 2. Environment Configuration
Navigate to `backend/` and verify `.env`:
```bash
cp backend/.env.example backend/.env
```
Default `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/research_opportunity_db
NODE_ENV=development
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Run the Development Server
```bash
npm run start:dev
```
The API will be live at `http://localhost:5000/api`.

---

## 📡 API Endpoints

### 1. Create an Opportunity
- **Endpoint**: `POST /api/opportunities`
- **Status**: `201 Created`
- **Request Body**:
```json
{
  "title": "Deep Learning in Medical Imaging",
  "description": "Assist in developing generative diffusion models for MRI scan reconstruction.",
  "department": "Biomedical Engineering",
  "professor": "Dr. Elena Rostova",
  "status": "Open",
  "category": "Artificial Intelligence",
  "requirements": ["Python", "PyTorch", "Linear Algebra"],
  "deadline": "2026-11-30T23:59:59.000Z",
  "stipend": "$1,800 / month",
  "location": "Hybrid",
  "contactEmail": "elena.rostova@univ.edu",
  "openSpots": 2
}
```

### 2. Get All Opportunities
- **Endpoint**: `GET /api/opportunities`
- **Query Params (Optional)**:
  - `status`: e.g. `?status=Open` or `?status=Closed`
  - `department`: e.g. `?department=Biomedical`
  - `category`: e.g. `?category=Artificial Intelligence`
  - `search`: Searches across title, description, department, and professor
- **Status**: `200 OK`

### 3. Get Opportunity by ID
- **Endpoint**: `GET /api/opportunities/:id`
- **Status**: `200 OK`
- **Not Found**: Returns `404 Not Found` if ID does not exist or has been deleted.
- **Invalid ID**: Returns `400 Bad Request` if ID is not a valid 24-character hexadecimal MongoDB ObjectId.

### 4. Update Opportunity (Mark as Closed)
- **Endpoint**: `PUT /api/opportunities/:id`
- **Status**: `200 OK`
- **Request Body**:
```json
{
  "status": "Closed",
  "openSpots": 0
}
```

### 5. Delete Opportunity
- **Endpoint**: `DELETE /api/opportunities/:id`
- **Status**: `200 OK`
- **Post-Delete Behavior**: Any subsequent `GET /api/opportunities/:id` or `DELETE /api/opportunities/:id` will return `404 Not Found`.

---

## 🧪 Testing

Run unit tests:
```bash
cd backend
npm test
```
Run end-to-end tests:
```bash
npm run test:e2e
```

---

## 📬 Postman
Import the file located at [`postman/Opportunities_API.postman_collection.json`](postman/Opportunities_API.postman_collection.json) into Postman to quickly test all endpoints.
