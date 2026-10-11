# JobTrail - Frontend (React 18 + Vite)

**JobTrail Frontend** is a modern, responsive Single Page Application (SPA) built with React 18, Vite, and React Router v6 to interface seamlessly with the Django REST Framework API.

---

## 🔗 Related Repositories
- **Backend Repository**: [JobTrail Backend (Django REST Framework)](https://github.com/BipronathSaha12/jobtrail-backend)

---

## 🎨 Design System & Aesthetic Direction
- **Theme**: Dark modern developer workspace aesthetic with glassmorphism elements.
- **Color Coding**: Visually distinct status badges:
  - `WISHLIST`: Slate / Gray
  - `APPLIED`: Electric Blue
  - `INTERVIEW`: Purple
  - `OFFER`: Emerald Green
  - `REJECTED`: Rose Red
- **Responsiveness**: Fully responsive across devices from desktop down to 390px mobile viewports.

---

## 🔐 Demo Accounts for Testing & Evaluation

| User Type | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Client Job Seeker Demo** | `demo` | `demo123` | Pre-seeded with 16 realistic applications (Wishlist, Applied, Interview, Offer, Rejected) with 1-click login on `/login` |
| **Secondary Job Seeker** | `demouser` | `password123` | Alternative pre-seeded demo user |
| **Admin Superuser** | `admin` | `admin123` | Django Admin Panel access (`/admin/`) |

---

## 🚀 Setup & Local Execution

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL=http://127.0.0.1:8000/api` is configured.

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🗺️ App Route Table

| Route | Access Level | Component / Screen | Description |
| :--- | :--- | :--- | :--- |
| `/login` | Public | `Login.jsx` | User authentication form (supports Username or Email login) |
| `/register` | Public | `Register.jsx` | User registration with field-level validation feedback |
| `/` | Protected | `Dashboard.jsx` | Analytics overview with 5 live API stat cards & recent activity |
| `/applications` | Protected | `ApplicationList.jsx` | Server-side paginated & filtered applications list with modal delete |
| `/applications/new` | Protected | `ApplicationForm.jsx` | Form to create a new job application |
| `/applications/:id/edit` | Protected | `ApplicationForm.jsx` | Form to edit an existing application pre-filled from API |

---

## 🛠️ Essential Features Implemented
- Single Axios client with Bearer JWT interceptor and silent 401 unauth redirect.
- Protected Routes preventing unauthorized screen flashes.
- Server-side search (`?search=`), status filter (`?status=`), job type filter (`?job_type=`), and pagination with page reset.
- Field-level DRF error message rendering under input fields on 400 responses.
- Custom confirmation modal for deletions (no standard browser alert/confirm).
- Complete loading skeleton, empty state, and error state retry UI components.

---

## 🔮 Future Enhancements
With additional time, the following features would be added:
1. Drag-and-drop Kanban board view (`dnd-kit`).
2. Monthly application trend charts using `Recharts`.
3. Export applications to CSV/Excel formats.
