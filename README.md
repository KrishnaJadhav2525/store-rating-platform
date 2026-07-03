# Store Rating Platform

A full-stack web application where users submit 1–5 star ratings for stores. Built for the FullStack Intern Coding Challenge.

**Stack**
- Backend: Node.js + Express + Sequelize
- Database: PostgreSQL
- Frontend: React (Vite) + Tailwind CSS

## Roles

| Role | Capabilities |
|---|---|
| System Administrator | Add stores, normal users, and admin users. View dashboard (total users/stores/ratings). View & filter/sort user and store listings. View user details (store owners show their store's rating). |
| Normal User | Sign up, log in, update password. Browse/search stores by name and address. Submit and modify a 1–5 rating per store. |
| Store Owner | Log in, update password. View a dashboard listing everyone who rated their store, plus the store's average rating. |

Validation rules (enforced on both frontend and backend):
- Name: 20–60 characters
- Address: up to 400 characters
- Password: 8–16 characters, at least one uppercase letter and one special character
- Email: standard email format

## Project structure

```
project/
├── backend/     Express API + Sequelize models + PostgreSQL
└── frontend/    React (Vite) single-page app
```

## Setup

### 1. Database

Create a PostgreSQL database (locally or via a hosted provider):

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit .env with your PostgreSQL credentials and a strong JWT_SECRET
npm install
npm start
```

On first run the server automatically creates the required tables and seeds one
System Administrator account using the `DEFAULT_ADMIN_*` values in `.env`
(defaults: `admin@storerating.com` / `Admin@1234`). Log in with this account to
add every other user and store — sign-up is only available for normal users.

The API runs on `http://localhost:5000` by default.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the
backend at `http://localhost:5000` (see `vite.config.js`).

### 4. Log in

- Go to `http://localhost:5173/login`
- Log in as the seeded administrator to create store owners, stores, and other admins.
- Or go to `/signup` to register a normal user account directly.

## API overview

All endpoints are prefixed with `/api`.

- `POST /auth/signup` — normal user registration
- `POST /auth/login` — login for any role
- `PUT /auth/update-password` — change password (any logged-in role)
- `GET /auth/me` — current user profile
- `GET /admin/dashboard` — totals (admin only)
- `POST /admin/users` — create user of any role (admin only)
- `GET /admin/users` — list/filter/sort users (admin only)
- `GET /admin/users/:id` — user detail (admin only)
- `POST /admin/stores` — create store, optional owner assignment (admin only)
- `GET /admin/stores` — list/filter/sort stores with rating (admin only)
- `GET /user/stores` — list/search stores with overall + own rating (normal user only)
- `POST /user/stores/:storeId/rating` — submit/update a rating (normal user only)
- `GET /store-owner/dashboard` — raters list + average rating (store owner only)
# store-rating-platform
