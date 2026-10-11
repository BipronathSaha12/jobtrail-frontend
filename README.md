# JobTrail - Frontend (React + Vite)

**JobTrail Frontend** is a modern Single Page Application (SPA) built with React 19, Vite, and React Router to interface with the Django REST Framework API.

---

## 🔗 Connected Repositories & Deployments

| Component | Repository | Live Deployment URL |
| :--- | :--- | :--- |
| **Frontend (React + Vite)** | [jobtrail-frontend](https://github.com/BipronathSaha12/jobtrail-frontend) | [Live Frontend on Vercel](https://jobtrail-frontend-one.vercel.app/) |
| **Backend (Django REST)** | [jobtrail-backend](https://github.com/BipronathSaha12/jobtrail-backend) | [https://jobtrail-backend-3.onrender.com](https://jobtrail-backend-3.onrender.com) |
| **Backend API Root** | — | [https://jobtrail-backend-3.onrender.com/api/](https://jobtrail-backend-3.onrender.com/api/) |
| **Django Admin Panel** | — | [https://jobtrail-backend-3.onrender.com/admin/](https://jobtrail-backend-3.onrender.com/admin/) |

---

## 🚀 Recent Major Enhancements & Upgrades

### 1. 📋 Drag-and-Drop Kanban Board View (`@dnd-kit/core`)
- **Pipeline Workflow**: Visual board separating applications into 5 stages (`Wishlist`, `Applied`, `Interview`, `Offer`, `Rejected`).
- **Smooth Drag-and-Drop**: Built using `@dnd-kit/core` with `PointerSensor` and `TouchSensor`. Configured with activation constraints (`delay: 200ms`, `distance: 6px`) to ensure touch-scrolling on mobile devices is smooth without accidental drag triggers.
- **Optimistic UI Updates**: Instantly updates card placement and calls `PATCH /api/applications/<id>/` in the background with rollback error handling.
- **Mobile Column Navigation**: Tab switcher allows switching between viewing all columns simultaneously or focusing on a single stage.
- **Accessible Quick-Move**: Includes an inline "Move to" select dropdown on every card for tap/keyboard navigation.
- **Code-Splitting**: Dynamically loaded via `React.lazy` and `<Suspense>` for fast initial page load times.

### 2. 📊 Monthly Application Trend Charts (`recharts`)
- **Dual Visualizations**:
  - **Area Trend Velocity**: Monotone gradient area chart visualizing monthly application volume.
  - **Status Breakdown**: Multi-color stacked bar chart visualizing monthly distribution across all 5 recruitment stages.
- **Glassmorphic Tooltip**: Custom dark translucent tooltip displaying stage counts and month totals.
- **Key Metric Badges**: Highlights peak application month, tracked total, interview count, and offers won.

### 3. 📥 Export Applications to CSV and Excel (`xlsx`)
- **Format Options**: One-click export to either **Comma-Separated Values (.csv)** or native **Microsoft Excel Workbook (.xlsx)**.
- **Dual Support**: Instant client-side file generation using SheetJS (`xlsx`) alongside backend streaming from `/api/applications/export/`.
- **Excel Encoding Compatibility**: Prepends UTF-8 Byte Order Mark (`\uFEFF`) so Excel on Windows properly formats text and characters.
- **Accessible Placement**: Export dropdown available across the Dashboard, All Applications List, and Kanban Board.

### 4. 📱 Mobile Responsiveness (300px to 650px Devices)
- **Toggleable Hamburger Navbar**: Collapsible menu with animated `Menu`/`X` toggle button, slide-down drawer, backdrop blur, and full touch targets. Closes automatically on route changes.
- **Fluid Card Scaling**:
  - **Stats Cards**: Responsive 2-column grid (`repeat(2, minmax(0, 1fr))`) preventing text/number overflow on small screens.
  - **Job Cards**: Full-width fluid layout with dynamically calculated heights and 44px tap-friendly buttons.
  - **Kanban Board**: Horizontally swipeable snap containers or single-column tab views tailored for narrow viewports.
- **Zero Horizontal Overflow**: Body and container rules preventing horizontal blowout down to 300px.

### 5. ⚡ Pre-Seeded 200+ Job Posts & Smart Pagination
- **215 Real-World Applications**: Pre-seeded across 70+ top companies and 30+ engineering, product, and data roles.
- **Windowed Pagination**: Smart ellipsis window (`1 … 4 5 [6] 7 8 … 22`) cleanly handles 22+ pages without UI wrapping.

---

## 🎨 Design System
- **Theme**: Premium Dark Slate workspace with Electric Indigo and Cyan accents.
- **Typography**: Google Fonts (*Plus Jakarta Sans* and *JetBrains Mono*).
- **Status Badges**:
  - `WISHLIST`: Slate / Gray
  - `APPLIED`: Electric Blue
  - `INTERVIEW`: Purple
  - `OFFER`: Emerald Green
  - `REJECTED`: Rose Red

---

## 🔐 Demo Accounts for Testing & Evaluation

| User Type | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Client Job Seeker Demo** | `demo` | `demo123` | Pre-seeded with 215 applications (1-click access on `/login`) |
| **Secondary Job Seeker** | `demouser` | `password123` | Alternative pre-seeded demo user |
| **Admin Superuser** | `admin` | `admin123` | Django Admin Portal (`/admin/`) |

---

## 🗺️ App Route Table

| Route | Access Level | Component | Description |
| :--- | :--- | :--- | :--- |
| `/login` | Public | `Login.jsx` | Authentication form with 1-click demo access buttons |
| `/register` | Public | `Register.jsx` | User registration with validation feedback |
| `/` | Protected | `Dashboard.jsx` | Stats metrics, Monthly Trend Chart, Recent applications, and Export |
| `/applications` | Protected | `ApplicationList.jsx` | Paginated and filtered applications list with Export and status updates |
| `/kanban` | Protected | `KanbanBoard.jsx` | Drag-and-drop Kanban pipeline board with mobile column switcher |
| `/applications/new` | Protected | `ApplicationForm.jsx` | Form to create a new job application |
| `/applications/:id/edit` | Protected | `ApplicationForm.jsx` | Form to edit an existing application pre-filled from API |

---

## 🚀 Setup & Local Execution

1. **Clone repository**:
   ```bash
   git clone https://github.com/BipronathSaha12/jobtrail-frontend.git
   cd jobtrail-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file:
   ```bash
   VITE_API_URL=http://127.0.0.1:8000/api
   ```
   *(In production, if `VITE_API_URL` is omitted, the client automatically falls back to `https://jobtrail-backend-3.onrender.com/api`)*

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

5. **Production Build**:
   ```bash
   npm run build
   ```
