# 🎟️ VibePass - Multi-Role Smart Event Automation Platform

![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![JWT](https://img.shields.io/badge/Auth-JWT-red)
![Status](https://img.shields.io/badge/Status-Completed-success)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-purple)

## 🚀 Live Demo

🌐 **Live Application:** https://vibe-pass-gold.vercel.app

---

# 📌 Overview

**VibePass** is a modern full-stack event management and ticket booking platform designed to automate the complete event lifecycle.

The platform supports multiple user roles including:

- 👤 Attendees
- 🎤 Organizers
- 🛡️ Event Staff

Users can discover events, purchase digital tickets, generate QR-based passes, validate entries, and manage events through dedicated dashboards.

The system focuses on security, scalability, and seamless user experience through JWT authentication and QR-code-powered ticket verification.

---

# ✨ Key Features

## 👤 Attendee Features

- User Registration & Login
- JWT-Based Authentication
- Browse Published Events
- View Event Details
- Purchase Event Tickets
- Generate Digital Event Passes
- QR Code Ticket Access
- Like Events
- Share Events
- View Purchased Tickets
- Ticket Status Tracking

---

## 🎤 Organizer Features

- Organizer Registration
- Create Events
- Edit Events
- Publish / Unpublish Events
- Manage Ticket Types
- Set Ticket Pricing
- Track Ticket Availability
- Monitor Event Performance
- View Event Registrations

---

## 🛡️ Staff Features

- Staff Authentication
- Ticket Validation Dashboard
- QR Code Scanning
- Real-Time Ticket Verification
- Prevent Duplicate Entry
- Mark Tickets as Used
- Event Entry Management

---

# 🔐 Authentication & Security

- JWT Token Authentication
- Role-Based Access Control (RBAC)
- Protected Routes
- Secure API Communication
- Authorization Middleware
- Session Persistence

---

# 🎫 Ticketing System

### Smart Ticket Generation

After successful purchase:

- Unique Ticket ID is generated
- QR Code is generated automatically
- Ticket linked to attendee account
- Digital pass available instantly

### QR Validation Workflow

```text
Purchase Ticket
       ↓
Generate QR Code
       ↓
Attendee Receives Pass
       ↓
Staff Scans QR
       ↓
Ticket Verification
       ↓
Entry Approved / Rejected
```

---

# 🏗️ System Architecture

```text
React Frontend
      │
      ▼
Spring Boot REST APIs
      │
      ▼
Service Layer
      │
      ▼
Spring Data JPA
      │
      ▼
MySQL Database
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Framer Motion
- Axios
- Tailwind CSS

## Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication

## Database

- MySQL
- Aiven Cloud Database

## Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Aiven

---

# 📸 Core Modules

## Event Management

- Create Event
- Publish Event
- Update Event
- Delete Event
- Manage Tickets

## Ticket Management

- Ticket Purchase
- QR Generation
- Ticket Validation
- Ticket History

## User Management

- Registration
- Login
- Role Assignment
- Profile Management

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/vibepass.git
cd vibepass
```

---

## Backend Setup

```bash
cd server
```

Configure:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

jwt.secret=
```

Run:

```bash
mvn spring-boot:run
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# 🌍 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Aiven MySQL |

---

# 📈 Future Enhancements

- Online Payment Gateway Integration
- Email Ticket Delivery
- Push Notifications
- Analytics Dashboard
- Event Recommendations
- Seat Selection System
- Mobile Application
- AI-Based Event Suggestions

---

# 👨‍💻 Developer

**Avinash Soni**

### Skills Used

- Java
- Spring Boot
- React.js
- MySQL
- Hibernate
- JWT
- REST APIs
- Tailwind CSS
- Cloud Deployment