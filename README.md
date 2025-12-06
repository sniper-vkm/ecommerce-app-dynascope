# 🛒 Next.js E-Commerce Application

A full-stack E-commerce platform built with **Next.js (App Router)**, featuring role-based authentication, protected routes via Middleware, and a file-based JSON database.

## 🚀 Features

-   **Authentication & Security**
    -   JWT-based Authentication (HttpOnly Cookies).
    -   **Middleware Protection**: Edge-compatible manual JWT decoding to protect routes without external heavy libraries.
    -   **Role-Based Access Control**:
        -   **Admin**: Access to `/admin` dashboard.
        -   **User**: Access to Cart and Checkout.
        -   **Public**: Product listing and Login.
-   **Product Management**: Browse products (Admin can manage products).
-   **Shopping Cart**: Add items, view summary.
-   **JSON Database**: Lightweight data persistence using local JSON files (no external DB required).

## 🛠️ Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: JavaScript / Node.js
-   **State Management**: React Context API (`AuthContext`)
-   **Authentication**: JSON Web Tokens (JWT) with Custom Middleware
-   **Styling**: CSS Modules / Tailwind CSS (Assumed)
-   **Database**: Local File System (JSON)

---

## 📂 Project Structure

```bash
.
├── app/
│   ├── api/                # Backend API Routes (Auth, Products)
│   ├── admin/              # Protected Admin Pages
│   ├── (auth)/             # Login / Signup Pages
│   ├── cart/               # Shopping Cart Page
│   └── page.js             # Homepage
├── context/
│   └── AuthContext.js      # Global Auth State & Token decoding
├── lib/
│   └── db.js               # Helper to read/write JSON files
├── middleware.js           # 🛡️ Central Logic for Route Protection
├── public/                 # Static assets
└── data/ (or root)
    ├── users.json          # Mock Database for Users
    └── products.json       # Mock Database for Products
    