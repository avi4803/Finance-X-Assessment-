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
**Build Status: STABLE** // **Architecture: LAYERED** // 🚀💎🛡️🏁🏆
