# Company Outlook

**Internal company management dashboard** with invitation-based access.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

**URL**: http://localhost:5173

---

## 🔐 Authentication

**Invitation-Only Access** - No open signup!

### Flow:
1. User receives invitation email with unique token
2. Visit `/splash` (or any page → auto-redirect)
3. Enter invitation token
4. System verifies invite and shows login form
5. Enter email → login
6. Access granted based on role + department

### Demo Mode:
- Enter any token to test
- Mock verification for development

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Splash.jsx              # Entry point - invitation & login
│   ├── CompanyAdminNav.jsx     # Main hub dashboard
│   ├── ProductRoadmap.jsx      # Product roadmap management
│   ├── CompanyRoadmap.jsx      # Company strategic roadmap
│   ├── CompanyTasks.jsx        # Task management
│   ├── FinancialSpends.jsx     # Actual spending tracking
│   ├── FinancialProjections.jsx # Budget projections
│   ├── CompanyCrmHub.jsx       # CRM overview
│   ├── CompanyCrmList.jsx      # Contact list
│   └── UserMetrics.jsx         # User analytics
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   └── input.jsx
│   └── RoadmapWeighPointCreator.jsx  # Roadmap item creator
├── App.jsx                     # Routing & layout
└── main.jsx                    # Entry point
```

---

## 🎯 Features

### Product Roadmap
- Add/edit/delete roadmap items
- List, Kanban, and Timeline views
- Filter by status, priority, type
- Sort by priority, date, name
- LocalStorage persistence

### Role-Based Access
- Founder - Full access to everything
- Admin - Management access
- Manager - Department-specific
- Employee - Limited access

### Navigation
- Auto-filtered based on role + department
- Dynamic menu based on permissions

---

## 🔧 Tech Stack

- **React** 18.3
- **Vite** 5.4
- **React Router** 6.28
- **Tailwind CSS** 3.4
- **shadcn/ui** - UI components
- **Lucide React** - Icons

---

## 📝 Development

### Key Files:
- **App.jsx** - Routing and role-based navigation
- **Splash.jsx** - Invitation-based auth
- **ProductRoadmap.jsx** - Main roadmap functionality

### Storage:
- `localStorage.company_auth` - User auth data
- `localStorage.company_invite_token` - Invitation token
- `localStorage.product-roadmap-items` - Roadmap data

---

## 🎨 UI/UX

- **Dark Mode** - Toggle in sidebar
- **Responsive** - Mobile-friendly design
- **Clean Design** - Modern, professional UI
- **Empty States** - Helpful guidance
- **Role Indicators** - Clear user context

---

## 📚 Architecture

See backend docs:
- `COMPANY_OUTLOOK_ARCHITECTURE.md` - Schema and data models
- `COMPANY_OUTLOOK_AUTH.md` - Authentication flow
- `docs/AUTH-ARCHITECTURE.md` - Unified auth patterns

---

## ✅ Status

- ✅ Invitation-based auth (Splash)
- ✅ Product roadmap (fully functional)
- ✅ Role-based navigation
- ✅ Dark mode
- ✅ LocalStorage persistence
- ⏳ Backend integration (pending)
- ⏳ Task management
- ⏳ Financial tracking
- ⏳ CRM

**Last Updated**: 2025-01-01

