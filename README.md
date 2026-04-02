# 🏛️ FinanceX Dashboard: Data Processing & Access Control

This project is a high-quality, professional-grade backend and frontend ecosystem built to solve the **Finance Data Processing Assignment**. It focuses on the secure management of financial records, role-based governance, and real-time analytical summaries.

---

## **🎯 Project Objective**
To build a reliable, logically organized system that manages financial transactions while strictly enforcing user permissions. This implementation demonstrates clean architecture, robust data validation, and meaningful analytical insights.

---

## **✨ Key Features (Assignment Requirements)**

### **1. 🛡️ User & Role Management (RBAC)**
I have implemented a tiered authority system to control exactly what a user can see and do:
*   **ADMIN**: Full management access (Users, Transactions, Audit Logs).
*   **ANALYST**: Strategic access. Can view summaries and edit/create records but cannot delete them.
*   **VIEWER**: Read-only access to the dashboard and ledger.
*   **Status Control**: Admins can toggle any user between `ACTIVE` and `INACTIVE` to instantly revoke system access.

### **2. 📋 Financial Records Management (The Ledger)**
A complete engine for financial entries with support for:
*   **Detailed Records**: Amount, Type (Income/Expense), Category, Date, and Notes.
*   **Smart Filtering**: Query records by date range, category, or type.
*   **Soft Delete**: Transactions are never truly lost. They are "Soft Deleted" to maintain an audit trail while being removed from the active dashboard.

### **3. 📊 Dashboard Summary (Intelligence)**
Instead of just showing raw data, the backend provides pre-calculated analysis:
*   **Net Liquidity**: Real-time calculation of Income vs. Expenses.
*   **Volume Index**: Category-wise distribution of spending.
*   **Trend Pulse**: A rolling 10-point liquidity flow chart showing balance movements.

### **4. ⚙️ Access Control & Security**
*   **Middleware Guard**: Every single request is intercepted by a "Gatekeeper" middleware that checks the user's JWT token and their Role before allowing the action.
*   **Input Validation**: I use **Zod** to ensure that no "bad data" ever reaches the database. If a field is missing or an amount is negative, the system provides a clear, polite error message.

---

## **🛠️ Tech Stack**
*   **Frontend**: Next.js 15 & Tailwind CSS (Modern, Responsive UI).
*   **Backend**: Node.js & Express (Robust, Industry-Standard API).
*   **Database**: **Prisma ORM** with **PostgreSQL** (Enterprise Persistence).
*   **Validation**: Zod (Schema-based validation).
*   **Security**: JWT (Bearer tokens) & Bcryptjs (Password Hashing).

---

## **⚡ Quick Start (Setup Instructions)**

### **1. Backend Setup**
1.  Navigate to the root folder: `npm install`
2.  Set up your `.env` (See `.env.example`).
3.  Generate the database client: `npx prisma generate`
4.  Launch the API: `npm run dev`

### **2. Frontend Setup**
1.  Navigate to the `/frontend` folder: `npm install`
2.  Launch the Dashboard: `npm run dev`

---

## **🛡️ Built-in Enhancements (Going Above & Beyond)**
*   ✅ **JWT Authentication**: Secure sessions for all operatives.
*   ✅ **Audit Logging**: Every sensitive change is recorded in an immutable compliance ledger.
*   ✅ **Soft Delete**: Logic to preserve data integrity for auditing.
*   ✅ **Rate Limiting**: Protection against automated brute-force attacks.
*   ✅ **Unit Tests**: Mathematical verification of core financial logic via **Vitest**.

---

## **📖 Detailed API Reference (Usage Guide)**

Every internal system interaction is documented below with **JSON request** and **JSON response** samples for immediate testing.

### **1. Authentication Gateway** 🔐
Used to initialize an operative session and receive a secure JWT bearer token.

**`POST /auth/login`** (Public)
*   **Request Payload**:
    ```json
    {
      "email": "admin@financex.core",
      "password": "secure_hash_2026"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiJ9...",
        "user": { "id": "uuid-1", "role": "ADMIN", "name": "Lead Operative" }
      }
    }
    ```

---

### **2. Financial Ledger (Records)** 🔎
Used to manage income and expenses. Access varies (VIEWER: Read-Only | ADMIN: Full Control).

**`GET /transactions`** (All Roles)
*   **Query Params**: `?category=INFRASTRUCTURE&limit=10`
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "tx-101",
          "amount": 250.00,
          "type": "EXPENSE",
          "category": "UTILITIES",
          "date": "2026-04-01T10:00:00Z"
        }
      ]
    }
    ```

**`POST /transactions`** (ADMIN / ANALYST Only)
*   **Request Payload**:
    ```json
    {
      "amount": 1500.00,
      "type": "INCOME",
      "category": "SALARY",
      "notes": "Q1 Project Bonus"
    }
    ```

---

### **3. Intelligence Summary (Analytics)** 📈
Calculates and returns high-level summary metadata for the dashboard.

**`GET /dashboard/analytics`** (All Roles)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "summary": {
          "totalIncome": 15000,
          "totalExpense": 8000,
          "netBalance": 7000
        },
        "distribution": {
          "expense": [{ "category": "INFRASTRUCTURE", "amount": 4000 }]
        }
      }
    }
    ```

---

### **4. Governance Nexus (Admin Controls)** 🛡️
Used by the **Lead Admin** to manage operatives and view security audit trails.

**`GET /users`** (ADMIN ONLY)
*   **Response**: Returns the registry of all accounts and their current authority levels.

**`PATCH /users/:id`** (ADMIN ONLY)
*   **Request Payload**: Change a user's role or access status instantly.
    ```json
    {
      "role": "ANALYST",
      "status": "INACTIVE"
    }
    ```

---
**FinanceX v1.5.0** // SECURE_MAIN_TUNNEL: ACTIVE // 🚀💎🛡️🏁🏆
