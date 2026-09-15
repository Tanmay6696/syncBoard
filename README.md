# Document Management App

A full-stack document management application with secure, cookie-based JWT authentication.

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios

**Backend**
- Spring Boot
- Spring Security
- JWT (httpOnly cookie-based auth)
- Spring Data JPA

## Features

- User registration and login
- Secure authentication using httpOnly cookies (no tokens in localStorage)
- Protected routes on the frontend
- Document upload/management *(update this section with your actual features)*

## Project Structure

```
├── frontend/          # React + Vite app (runs on :5173)
│   ├── src/
│   │   ├── api/       # Axios API calls
│   │   ├── pages/     # Login, Register, Documents, etc.
│   │   └── ...
│
└── backend/           # Spring Boot app (runs on :8084)
    ├── controller/
    ├── service/
    ├── repository/
    └── ...
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Java 17+
- Maven
- MySQL / PostgreSQL *(update based on your DB)*

### Backend Setup

```bash
cd backend
# configure application.properties / application.yml with your DB credentials
mvn spring-boot:run
```

The backend will start on `http://localhost:8084`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Authentication

This app uses **httpOnly cookies** for authentication instead of storing tokens in `localStorage`, to reduce exposure to XSS attacks.

- On login, the backend issues an `access_token` cookie (`httpOnly`, `SameSite=Lax`).
- The frontend must send requests with `withCredentials: true` so the browser includes the cookie.
- The backend CORS configuration must allow the specific frontend origin (`http://localhost:5173`) with `allowCredentials(true)` — wildcard origins (`*`) are not permitted with credentialed requests.

> **Note:** In production, set the cookie's `secure` flag to `true` (requires HTTPS) and update the allowed CORS origin to your deployed frontend URL.

## Environment Variables

*(Fill in whichever your project actually uses)*

**Backend**
```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
```

**Frontend**
```
VITE_API_BASE_URL=http://localhost:8084
```

## License

*(Add your license here, e.g. MIT)*
