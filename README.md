# 💇‍♀️ Hair E-Commerce Website

A modern, full-stack e-commerce platform for hair products, built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.  
This project enables customers to browse, purchase, and manage hair products online, while allowing admins to control inventory, orders, and user accounts — all through a secure dashboard.

---

## 🏗️ Project Overview

The Hair E-Commerce platform was designed and developed for a hair business to digitize product sales and customer management.  
It supports online payments via **Hubtel**, local delivery and pickup, and includes a full **admin dashboard** for product and order management.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite + Tailwind CSS + TypeScript |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL (via Supabase) |
| **Payment Gateway** | Hubtel API |
| **Hosting (Frontend)** | Vercel |
| **Hosting (Backend)** | Render |
| **Design Tool** | Figma |
| **Version Control** | Git + GitHub |

---

## 🧩 Key Features

### 🛍️ Customer Features
- Browse wigs, weaves, and extensions by category or filter (type, length, color, price)
- View detailed product information with images, description, and reviews
- Add to cart, update quantities, and proceed to checkout
- Secure payments with **Hubtel**
- Track orders and shipping status
- User account for registration, login, and viewing past orders

### 🧑‍💼 Admin Features
- Add, edit, and delete products
- Manage orders and update shipping/payment statuses
- Manage user accounts
- Secure login with **JWT authentication**

---

## 🗂️ Project Structure

hair-ecommerce-main/
├── backend/ # Node.js + Express API (hosted on Render)
├── frontend/ # React + Vite + Tailwind CSS (hosted on Vercel)


---

## 🔒 Security
- Passwords hashed with **bcrypt**
- Authentication handled via **JWT**
- Input validation and secure API routes
- Protected admin routes

---

## 💳 Payments & Shipping
- **Hubtel integration** for online payments
- Supports **local courier delivery** and **pickup options**

---

## ⚙️ API Endpoints (Examples)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | User login (returns JWT) |
| `GET` | `/products` | Fetch all products |
| `GET` | `/products/:id` | Fetch product details |
| `POST` | `/checkout` | Process order and payment |
| `GET` | `/admin/products` | Manage products (Admin only) |

---

## 🧪 Testing
- Unit and integration testing for major features  
- Full end-to-end checkout flow testing  
- Responsive layout testing (mobile, tablet, desktop)  
- Performance optimization and load testing

---

## 🚀 Deployment
| Service | Usage |
|----------|--------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **Supabase** | Database & authentication |
| **Namecheap** | Domain setup |

---

## 🎨 Design
- UI/UX designed in **Figma**
- Brand colors: **Gold & Black**
- Modern, clean, and responsive layout

---

## 🧾 License
This project is proprietary and developed for a client.  
All rights reserved © 2025.

---

## ✨ Author
**Developer:** Joseph Okore Agyapong  
📧 agyapongjoseph222@gmail.com  
🌐 https://josephagyapong-portfolio.vercel.app 
GitHub link: https://github.com/agyapongjoseph

---

> _Built with care and precision — a complete digital storefront for modern hair businesses._
