# 🏛️ FinanceX: Enterprise Intelligence Dashboard

**FinanceX** is a high-performance, portfolio-grade financial monitoring ecosystem. It integrates a secure, throttled **Node.js/TypeScript API** with a stunning **Next.js 15 Command Center** to provide real-time transactional telemetry, automated analytical insights, and immutable governance logs.

---

## **🚀 Core Mission Systems**

1.  **🛡️ Command Center (Unified Analytics)**: Consolidation of total liquidity, revenue flow, and expense distribution into a single, high-speed dashboard. (Replaces the legacy 'Insights' tab).
2.  **📋 Ledger Registry (Transactions)**: Full-spectrum transactional management with **Soft-Data Retention** and **Zod Validation**.
3.  **📈 Intelligence Pulse**: Real-time 10-point liquidity trend tracking and volume index aggregation via DB-level grouping.
4.  **⚖️ Governance Nexus (Admin Hub)**: Complete RBAC (Role-Based Access Control) management, account activation/deactivation, and an immutable security audit trail.

---

## **🛠️ The Tech Stack**

### **Frontend Architecture**
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn UI (Custom Midnight Theme)
- **State & Fetching**: TanStack Query (React Query)
- **Motion**: Framer Motion for UI/UX transitions
- **Visualization**: Recharts (Custom SVG-rendered telemetry)

### **Backend Mainframe**
- **Engine**: Node.js v22 + Express
- **ORM**: Prisma (PostgreSQL / SQLite ready)
- **Security**: JWT (jsonwebtoken), Bcryptjs, Helmet, Express-Rate-Limit
- **Logging**: Morgan + Custom Audit Transaction Logger

---

## **📖 API Reference & Documentation**

All API endpoints are prefixed with `/api/v1`. 

### **1. Authentication Gateway** 🔐
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Public | Authenticate operative and receive JWT |
| **POST** | `/auth/register` | Public | Onboard new identity (Default: VIEWER) |

**Sample Login Request:**
```json
{
  "email": "admin@financex.core",
  "password": "secure_hash_2026"
}
```
**Sample Login Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": { "id": "uuid-1", "role": "ADMIN", "name": "Lead Admin" }
  }
}
```

### **2. Financial Ledger (Records)** 🔎
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/transactions` | All | Fetch paginated/filtered transaction logs |
| **POST** | `/transactions` | ADMIN / ANALYST | Record new financial movement |
| **DELETE**| `/transactions/:id`| ADMIN ONLY | Perform soft-delete (Audit Logged) |

**Sample Transaction Entry:**
```json
{
  "amount": 4500.00,
  "type": "INCOME",
  "category": "CONSULTING",
  "notes": "Q1 Project Milestone #4"
}
```

### **3. Intelligence Telemetry** 📈
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/dashboard/analytics`| All | High-level summary metrics & distribution |
| **GET** | `/transactions?limit=10`| All | Real-time liquidity flow data points |

### **4. Governance Nexus** 🛡️
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/users` | ADMIN ONLY | View entire organization registry |
| **PATCH** | `/users/:id` | ADMIN ONLY | Update authority (Role) or Status |
| **GET** | `/audit` | ADMIN ONLY | Access the immutable security ledger |

---

## **⚡ Environment Configuration**

Create a `.env` in the root and frontend directories:

**Backend (`.env`):**
```bash
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/db" # Cloud DB (Postgres)
JWT_SECRET="enterprise_mainframe_key"
FRONTEND_URL="https://financex-dashboard.vercel.app"
```

**Frontend (`frontend/.env`):**
```bash
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

---

## **🛠️ Local Development Sequence**

1.  **Backend Initialization**:
    ```bash
    npm install
    npx prisma generate
    npx prisma migrate dev
    npm run dev
    ```
2.  **Frontend Initialization**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## **🛡️ Role Matrix (RBAC Authority)**

-   **ADMIN**: Global oversight. Modifies users, deletes records, views audit trail.
-   **ANALYST**: Strategic input. Records and modifies financial entries. Cannot delete or manage users.
-   **VIEWER**: Observation only. Access to dashboard telemetry and filtered ledger history.

---

**FinanceX v1.5.0** // SECURE_MAIN_TUNNEL: ACTIVE // 🚀💎🛡️🏁🏆
