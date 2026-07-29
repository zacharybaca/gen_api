# 🚀 API Creator — MERN Stack Scaffold Generator (Vite + Express)

A full-stack **MERN (MongoDB, Express, React, Node.js)** application that generates ready-to-use Express routes, controllers, and Mongoose models from a simple schema definition.

Define a data model in the browser, click **Generate**, and get production-ready CRUD boilerplate dropped straight into your project — or download individual files.

Built on a production-ready monorepo with single-command startup, pre-configured CORS + Vite proxy, JWT cookie auth, Socket.IO, Cloudinary avatar uploads, and email via Nodemailer.

---

## ✨ Key Features

### 🏗 Architecture
- **Monorepo:** Distinct `client/` and `server/` directories, one-command boot.
- **MVC Backend:** Models, Controllers, Routes, Middleware separation.
- **Graceful Shutdown:** Handles `SIGINT`/`SIGTERM` to cleanly close the DB connection.

### ⚡ Frontend (`client/`)
- **React 19 + Vite 6:** Lightning-fast HMR and optimized production builds.
- **React Router v7:** Nested routing with a shared Layout component.
- **Clerk (`@clerk/react-router`):** Drop-in authentication UI and session management. `ClerkProvider` wraps the entire app; use Clerk's `useUser`/`useClerk`, `<SignIn />`, `<SignUp />`, and `<SignedIn>`/`<SignedOut>` guards anywhere in the component tree.
- **Context API:** `AuthContext`, `FetcherContext`, `SocketContext` composable via `AppProvider`.
- **Custom `useFetcher` hook:** Centralized fetch wrapper with credential handling and error normalization.
- **react-toastify:** Drop-in toast notifications already wired to auth flows.
- **PropTypes:** Runtime prop validation on all provider and utility components.
- **ESLint + Prettier + Husky:** Pre-commit formatting and linting enforced automatically.
- **Vitest + Testing Library:** Unit and component tests out of the box, with coverage via `@vitest/coverage-v8`.

### 🔧 API Creator (Generator)
- **Schema Builder UI (`/create`):** Name a model, add fields with types (`String`, `Number`, `Boolean`, `Date`, `ObjectId`, `Mixed`) and required flags.
- **Preview mode:** Returns generated code in-browser without writing anything to disk — requires authentication.
- **Generate & Save mode:** Writes model, controller, and route files to `server/generated/` (requires authentication).
- **Download:** Download any individual generated file directly from the browser.
- **Full CRUD scaffold:** Every generated set includes a Mongoose model, an Express controller with `getAll`, `getById`, `create`, `update`, and `delete` handlers, and a router wired to the `protect` middleware.

### 🛡 Backend (`server/`)
- **JWT Auth:** `httpOnly` cookie-based tokens with 30-day expiry.
- **Role-based access:** `protect` (auth) and `admin` (`role === "admin"`) middleware.
- **Input validation:** `express-validator` enforced on register, login, and generator routes.
- **Password reset flow:** Secure token generation + Nodemailer SMTP email delivery. Auto-logs in after reset.
- **Socket.IO:** Per-user rooms wired on connection.
- **Cloudinary:** Optional avatar upload middleware via Multer.
- **Content moderation:** `leo-profanity` middleware rejects submissions containing flagged language.
- **Security:** `helmet`, `cors`, `express-rate-limit`, `bcryptjs` — all pre-configured and active.
- **Logging:** `morgan` request logger (colorized in dev, Apache Combined in production).
- **Vitest:** Backend unit tests for middleware and utilities, with coverage via `@vitest/coverage-v8`.

### 🔄 CI/CD
- **GitHub Actions:** Automatically lints, builds, and tests both `client` and `server` on every push/PR to `main`. Server job includes a syntax-check pass with `node --check`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)

### 1. Install all dependencies

```bash
npm run install-all
```

### 2. Configure environment

```bash
cp .env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secret, SMTP credentials, etc.
```

> **Frontend env:** Create `client/.env` and set (as needed):
> - `VITE_BACKEND_URL` — your backend URL (only needed in production; omit in local dev)
> - `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (only needed if enabling Clerk auth UI; from the [Clerk dashboard](https://dashboard.clerk.com))

> **Clerk setup (optional):** Sign up at [clerk.com](https://clerk.com), create an application, and copy the publishable key into `client/.env` and the secret key into `server/.env`.

### 3. Start development servers

```bash
npm run dev
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:5000    |

---

## 📂 Project Structure

```text
gen_api/
├── .env.example                  # Environment variable template
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI pipeline
├── .husky/
│   └── pre-commit                # Pre-commit lint + format hook
├── client/                       # React (Vite) Frontend
│   └── src/
│       ├── assets/               # Static assets (images, fonts, etc.)
│       ├── components/
│       │   ├── Auth/             # Login, Register, ForgotPassword, ResetPassword
│       │   ├── Generator/        # SchemaBuilder, FieldRow, GeneratedCode
│       │   ├── Layout/           # NavBar, Footer, Header
│       │   ├── Pages/            # Route-level page components (Home, NotFound)
│       │   └── Utility/          # ProtectedRoute, AdminRoute
│       ├── contexts/
│       │   ├── Auth/             # AuthContext + AuthProvider
│       │   ├── Fetcher/          # FetcherContext + FetcherProvider
│       │   ├── Socket/           # SocketContext + SocketProvider
│       │   └── AppProvider.jsx   # Composes all providers
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useFetcher.js
│       │   └── useSocket.js
│       ├── tests/                # Vitest component tests
│       ├── App.jsx               # Route definitions
│       └── main.jsx              # Entry point
├── server/                       # Express Backend
│   ├── controllers/              # Request handlers (auth, user, generator)
│   ├── generated/                # Output directory for generated files (git-ignored)
│   ├── middleware/               # Auth, error, Cloudinary, moderation
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── tests/                    # Vitest unit tests
│   ├── utils/                    # generateToken, sendEmail, codeGenerator
│   ├── app.js                    # Express app factory
│   └── server.js                 # HTTP + Socket.IO + DB entry point
└── package.json                  # Root scripts (dev, install-all, format)
```

---

## 🛠 Tech Stack

| Domain    | Technology                                             |
|-----------|--------------------------------------------------------|
| Frontend  | React 19, Vite 6, React Router v7, react-toastify      |
| Auth      | Clerk (`@clerk/react-router`), JWT (httpOnly cookies), bcryptjs |
| Backend   | Node.js, Express 4, Mongoose 8, Socket.IO 4            |
| Database  | MongoDB                                                |
| Email     | Nodemailer (SMTP)                                      |
| Storage   | Cloudinary (optional)                                  |
| Security  | helmet, express-rate-limit, cors, express-validator    |
| Testing   | Vitest, @testing-library/react, supertest              |
| Tooling   | ESLint, Prettier, Husky, Concurrently, Nodemon         |

---

## 📜 Available Scripts

| Command                 | Description                                           |
|-------------------------|-------------------------------------------------------|
| `npm run dev`           | Start both client and server concurrently             |
| `npm run client`        | Start Vite dev server only                            |
| `npm run server`        | Start Express server with Nodemon only                |
| `npm run install-all`   | Install dependencies for root, client, and server     |
| `npm run clean-install` | Remove all `node_modules`, then reinstall             |
| `npm run format`        | Run Prettier across client and server source files    |

Run tests individually from each package directory:

```bash
cd client && npm test              # Vitest component tests
cd client && npm run test:coverage # With V8 coverage report

cd server && npm test              # Vitest unit tests
cd server && npm run test:coverage # With V8 coverage report
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Route                          | Auth | Description                        |
|--------|--------------------------------|------|------------------------------------|
| POST   | `/register`                    | —    | Register a new user                |
| POST   | `/login`                       | —    | Login (sets JWT cookie)            |
| POST   | `/logout`                      | —    | Logout (clears JWT cookie)         |
| GET    | `/is-admin`                    | ✅   | Check if the current user is admin |
| POST   | `/forgotpassword`              | —    | Send password-reset email          |
| PUT    | `/resetpassword/:resettoken`   | —    | Reset password with token          |

### Users — `/api/users`

| Method | Route      | Auth | Description                              |
|--------|------------|------|------------------------------------------|
| GET    | `/profile` | ✅   | Get the logged-in user's profile         |
| PUT    | `/profile` | ✅   | Update profile (name, email, avatar)     |
| DELETE | `/profile` | ✅   | Delete account and Cloudinary avatar     |

### Generator — `/api/generator`

| Method | Route       | Auth | Description                                           |
|--------|-------------|------|-------------------------------------------------------|
| POST   | `/preview`  | ✅   | Return generated model/controller/route code (no disk writes) |
| POST   | `/generate` | ✅   | Generate and write files to `server/generated/`      |

**Request body for both routes:**
```json
{
  "modelName": "BlogPost",
  "fields": [
    { "name": "title",     "type": "String",  "required": true  },
    { "name": "body",      "type": "String",  "required": false },
    { "name": "author",    "type": "ObjectId","required": true  },
    { "name": "published", "type": "Boolean", "required": false }
  ]
}
```

Valid field types: `String`, `Number`, `Boolean`, `Date`, `ObjectId`, `Mixed`.

### Rate Limits

| Scope          | Limit              |
|----------------|--------------------|
| All `/api/*`   | 100 req / 15 min   |
| `/api/auth/*`  | 20 req / 15 min    |

---

## 🔑 Role-Based Access

Roles are stored as `role: "user" | "admin"` on the User document. There is no separate `isAdmin` flag.

- **`protect` middleware** — requires a valid JWT cookie. Use on any authenticated route.
- **`admin` middleware** — requires `role === "admin"`. Stack after `protect`.

```js
// Example protected admin route
router.get('/admin/stats', protect, admin, getStats);
```

---

## 🧩 How to Extend

### Add a new Mongoose model

1. Create `server/models/MyModel.js` with your schema.
2. Import it in the relevant controller.

### Add a new API route

1. Create `server/controllers/myController.js` with your handlers.
2. Create `server/routes/myRoutes.js` and define your endpoints.
3. Mount it in `server/app.js`:
   ```js
   import myRoutes from './routes/myRoutes.js';
   app.use('/api/my-resource', myRoutes);
   ```

### Add a new page

1. Create `client/src/components/Pages/MyPage.jsx`.
2. Add a `<Route>` in `client/src/App.jsx`:
   ```jsx
   <Route path="my-page" element={<MyPage />} />
   ```
3. Wrap with `<ProtectedRoute>` if authentication is required:
   ```jsx
   <Route element={<ProtectedRoute />}>
     <Route path="my-page" element={<MyPage />} />
   </Route>
   ```

---

## 🚢 Deployment

### Render (recommended)

1. **Backend** — Create a new **Web Service**, set root dir to `server/`, build command `npm install`, start command `npm start`. Add all env vars from `.env.example`.
2. **Frontend** — Create a new **Static Site**, set root dir to `client/`, build command `npm install && npm run build`, publish dir `dist`. Set `VITE_BACKEND_URL` to your backend's Render URL.

### Vercel + Railway

1. Deploy `server/` to **Railway** as a Node.js service. Set env vars in the Railway dashboard.
2. Deploy `client/` to **Vercel**. Set `VITE_BACKEND_URL` to your Railway backend URL.

### Environment Variables

| Variable              | Where        | Required | Description                                |
|-----------------------|--------------|----------|--------------------------------------------|
| `MONGO_URI`           | `server/.env`| ✅       | MongoDB connection string                  |
| `JWT_SECRET`          | `server/.env`| ✅       | Secret key for signing JWT tokens          |
| `NODE_ENV`            | `server/.env`| —        | `development` or `production`              |
| `PORT`                | `server/.env`| —        | Express port (default: `5000`)             |
| `CLIENT_URL`          | `server/.env`| —        | Allowed CORS origin                        |
| `FRONTEND_URL`        | `server/.env`| —        | Base URL for password reset links          |
| `SMTP_HOST`           | `server/.env`| —        | SMTP server host                           |
| `SMTP_PORT`           | `server/.env`| —        | SMTP server port (default: `587`)          |
| `SMTP_USER`           | `server/.env`| —        | SMTP username / email address              |
| `SMTP_PASS`           | `server/.env`| —        | SMTP password                              |
| `FROM_NAME`           | `server/.env`| —        | Sender display name for emails             |
| `FROM_EMAIL`          | `server/.env`| —        | Sender email address                       |
| `CLOUDINARY_CLOUD_NAME` | `server/.env`| —      | Cloudinary cloud name (avatar uploads)     |
| `CLOUDINARY_KEY`      | `server/.env`| —        | Cloudinary API key                         |
| `CLOUDINARY_SECRET`   | `server/.env`| —        | Cloudinary API secret                      |
| `CLERK_SECRET_KEY`    | `server/.env`| —        | Clerk secret key (required if you enable Clerk server-side verification) |
| `VITE_BACKEND_URL`    | `client/.env`| —        | Backend URL used by the Vite frontend (production only; omit in local dev) |
| `VITE_CLERK_PUBLISHABLE_KEY` | `client/.env`| — | Clerk publishable key (required if you enable Clerk in the frontend; from Clerk dashboard) |

