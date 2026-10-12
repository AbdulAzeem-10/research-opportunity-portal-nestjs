# University Research Opportunity Portal

A full-stack web application for managing university research opportunities, built with NestJS (backend) and React + Vite (frontend), using MongoDB Atlas for data persistence.

## 📋 Technology Stack

### Backend
- **Framework**: NestJS (Node.js with TypeScript)
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Validation**: class-validator & class-transformer
- **Configuration**: @nestjs/config with environment variables

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript
- **Styling**: Custom CSS
- **Icons**: Lucide React

### Key Features
- **REST API** with `/api` global prefix
- **CORS** configured for local development
- **Data Validation** with descriptive error messages (HTTP 400/404/500)
- **MongoDB Persistence** with automatic timestamps
- **Request Logging** middleware
- **Responsive UI** with loading/empty/error states
- **Real-time Updates** after CRUD operations

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
research-opportunity-portal/
├── backend/                    # NestJS REST API
│   ├── src/
│   │   ├── common/            # Global filters, middleware, pipes
│   │   ├── config/            # Database configuration
│   │   ├── opportunities/     # Feature module
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── enums/         # OpportunityStatus enum
│   │   │   ├── schemas/       # Mongoose schema
│   │   │   ├── opportunities.controller.ts
│   │   │   ├── opportunities.service.ts
│   │   │   └── opportunities.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                  # E2E tests
│   ├── .env                   # Environment variables (gitignored)
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                   # Frontend environment (gitignored)
│   ├── .env.example           # Frontend env template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/AbdulAzeem-10/research-opportunity-portal-nestjs.git
cd research-opportunity-portal-nestjs
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
Create `.env` file from the template:
```bash
cp .env.example .env
```

Edit `backend/.env` with your MongoDB Atlas credentials:
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/research_opportunity_db?retryWrites=true&w=majority

# Frontend origin for CORS
FRONTEND_ORIGIN=http://localhost:5173
```

#### Start Backend Server
```bash
npm run start:dev
```
The API will be accessible at `http://localhost:5000/api`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment
Create `.env` file from the template:
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Start Frontend Server
```bash
npm run dev
```
The application will open at `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Build
```bash
cd frontend

# Lint
npm run lint

# Build for production
npm run build
```

---

## 🌐 Using the Application

1. **Open the application** at `http://localhost:5173`
2. **Create an opportunity** by clicking "Post Opportunity"
3. **View details** by clicking on an opportunity card
4. **Edit** an opportunity using the edit button
5. **Mark as Closed** when positions are filled
6. **Delete** opportunities that are no longer relevant
7. **Search and Filter** by status (Open/Closed) or keywords

All data persists to MongoDB Atlas and survives page refreshes.

---

## 📬 API Testing

You can test the API directly using tools like Postman or curl:

```bash
# Get all opportunities
curl http://localhost:5000/api/opportunities

# Create a new opportunity
curl -X POST http://localhost:5000/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Research Assistant",
    "description": "Work on cutting-edge AI projects",
    "researchArea": "Artificial Intelligence",
    "facultyMemberName": "Dr. Smith",
    "department": "Computer Science",
    "requiredSkills": ["Python", "Machine Learning"],
    "numberOfPositions": 2,
    "applicationDeadline": "2027-12-31T23:59:59.000Z",
    "status": "Open"
  }'

# Get single opportunity
curl http://localhost:5000/api/opportunities/<id>

# Update opportunity
curl -X PUT http://localhost:5000/api/opportunities/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "Closed"}'

# Delete opportunity
curl -X DELETE http://localhost:5000/api/opportunities/<id>
```

---

## 🔒 Security Notes

- `.env` files are gitignored and never committed
- MongoDB credentials should be kept secure
- CORS is configured for development (localhost origins only)
- Input validation prevents malformed data
- MongoDB ObjectId format is validated before queries

---

## 📝 License

This project is created for educational purposes as part of a university assignment.

---

## 👨‍💻 Author

**Abdul Azeem**
- GitHub: [@AbdulAzeem-10](https://github.com/AbdulAzeem-10)
