# RFQ Marketplace

A mini B2B Request for Quotation (RFQ) marketplace where buyers can publish business requirements and suppliers can discover those requirements and submit quotations.

The application is designed as a simple, practical B2B marketplace that demonstrates authentication, role-based authorization, REST APIs, database design, validation, and a responsive React frontend.

---

## Live Application

**Live URL:**
*Add deployment URL here*

## GitHub Repository

**Repository:**
*Add GitHub repository URL here*

---

# Overview

The RFQ Marketplace connects two types of users:

* **Buyer** - Creates and manages business requirements and reviews quotations received from suppliers.
* **Supplier** - Discovers available RFQs and submits quotations based on the buyer's requirements.

The primary workflow is:

```text
Buyer
  │
  │ Creates RFQ
  ▼
┌─────────────────┐
│      RFQ        │
│ Product/Service │
│ Requirement     │
│ Quantity        │
│ Location        │
│ Deadline        │
└────────┬────────┘
         │
         │ Discover
         ▼
     Supplier
         │
         │ Submit quotation
         ▼
┌─────────────────┐
│   Quotation     │
│ Price           │
│ Delivery Time   │
│ Message         │
└────────┬────────┘
         │
         ▼
      Buyer
         │
         ▼
View received quotations
```

---

# Features

## Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Authentication-protected API endpoints
* Persistent login using the stored JWT
* Logout functionality

## Role-Based Access

The application supports two roles:

### Buyer

Buyers can:

* Create RFQs
* View their own RFQs
* Edit RFQs
* Manage RFQ status
* View quotations received from suppliers

### Supplier

Suppliers can:

* Browse available RFQs
* Search RFQs
* Filter RFQs by delivery location
* View complete RFQ details
* Submit quotations
* View previously submitted quotations

Users cannot access functionality belonging to the other role.

For example:

```text
Buyer → Buyer Dashboard
Supplier → Supplier Dashboard
```

Protected routes are enforced on both the frontend and backend.

---

# RFQ Management

A buyer can create an RFQ containing:

* Product or service name
* Requirement description
* Quantity
* Delivery location
* RFQ deadline

Buyers can then:

* View their submitted RFQs
* Open individual RFQs
* Edit RFQ information
* Manage RFQ status
* Review supplier quotations

---

# Supplier Quotation

Suppliers can open an RFQ and submit:

* Quoted price
* Estimated delivery time
* Message / notes

After submitting a quotation, suppliers can view their quotation history from the **My Quotations** section.

---

# Search and Filtering

Suppliers can search available RFQs using:

* Product name
* Requirement description

They can also filter RFQs using:

* Delivery location

The UI provides an appropriate empty state when no RFQs match the search or filter.

---

# User Experience

The frontend includes:

* Responsive layouts
* Loading states
* Empty states
* Error states
* Form validation feedback
* Protected pages
* Simple navigation
* Clear success messages
* Mobile-friendly layouts

The application intentionally keeps the interface simple and focused on the main B2B workflow instead of adding unnecessary features.

---

# Technology Stack

## Frontend

* React
* React Router
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* Zod
* CORS
* dotenv

## Database

* MySQL
* MySQL Workbench for local database management

## Development Tools

* Git
* GitHub
* VS Code
* Postman

---

# Architecture

The project follows a simple client-server architecture.

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express Server   │
                    │                     │
                    │ Routes              │
                    │ Controllers         │
                    │ Middleware          │
                    │ Services            │
                    │ Validation          │
                    └──────────┬──────────┘
                               │
                               │ SQL
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │                     │
                    │ Users               │
                    │ RFQs                │
                    │ Quotations          │
                    └─────────────────────┘
```

The frontend communicates with the Express backend through REST APIs.

The backend handles:

* Authentication
* Authorization
* Validation
* Business logic
* Database operations
* Error handling

MySQL provides persistent storage for users, RFQs and quotations.

---

# Project Structure

The project intentionally uses a simple folder structure to keep the application easy to understand and maintain.

```text
rfq-marketplace/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── buyer/
│   │   │   └── supplier/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── config/
│   │   └── server.js
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

The exact internal structure may evolve as the application is extended, but the project intentionally avoids unnecessary layers and abstractions.

---

# Database Design

The application uses MySQL as the relational database.

The core entities are:

```text
Users
  │
  ├──────────────┐
  │              │
  ▼              ▼
 RFQs        Quotations
  │              ▲
  │              │
  └──────────────┘
```

## Users

Stores authentication and user information.

Example fields:

```text
id
name
email
password
role
created_at
```

A user has one of two roles:

```text
BUYER
SUPPLIER
```

## RFQs

Stores requirements posted by buyers.

Example fields:

```text
id
buyer_id
product_name
description
quantity
delivery_location
deadline
status
created_at
updated_at
```

## Quotations

Stores supplier quotations submitted against RFQs.

Example fields:

```text
id
rfq_id
supplier_id
quoted_price
estimated_delivery
message
created_at
```

### Relationships

```text
User (Buyer)
     │
     │ 1:N
     ▼
    RFQ
     │
     │ 1:N
     ▼
Quotation
     ▲
     │ N:1
     │
User (Supplier)
```

This allows:

* One buyer to create multiple RFQs
* One RFQ to receive multiple quotations
* One supplier to submit quotations for multiple RFQs

---

# Authentication and Security

Authentication is implemented using JSON Web Tokens (JWT).

The general authentication flow is:

```text
Login
  │
  ▼
Validate credentials
  │
  ▼
Verify password
  │
  ▼
Generate JWT
  │
  ▼
Frontend stores token
  │
  ▼
Token sent with protected API requests
  │
  ▼
Backend verifies JWT
  │
  ▼
Request authorized
```

Passwords are never stored as plain text. They are hashed using bcrypt before being stored in the database.

Role-based authorization is handled using middleware.

For example:

```text
Authenticated User
       │
       ├── BUYER ──────► Buyer APIs
       │
       └── SUPPLIER ───► Supplier APIs
```

Environment variables are used for sensitive configuration such as:

```text
DATABASE_URL / database credentials
JWT_SECRET
PORT
```

`.env` files are excluded from Git using `.gitignore`.

---

# API Architecture

The backend exposes REST APIs for authentication, RFQs and quotations.

Typical API groups include:

```text
/api/auth
/api/rfqs
/api/quotations
```

Examples of operations include:

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### RFQs

```text
POST   /api/rfqs
GET    /api/rfqs
GET    /api/rfqs/:id
PUT    /api/rfqs/:id
```

### Quotations

```text
POST /api/quotations
GET  /api/quotations/my
```

The exact endpoints should be considered alongside the current backend route implementation.

---

# Validation and Error Handling

Input validation is implemented to prevent invalid data from entering the application.

Examples include:

* Required fields
* Valid email format
* Valid user role
* Valid quotation price
* Required RFQ information
* Authentication checks
* Authorization checks

The backend returns appropriate HTTP status codes and error messages.

The frontend handles:

```text
Loading
Success
Empty
Error
```

states to provide feedback to the user.

---

# Local Setup

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MySQL
* MySQL Workbench
* Git

---

# 1. Clone the Repository

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd rfq-marketplace
```

---

# 2. Setup the Database

Open MySQL Workbench and create a database:

```sql
CREATE DATABASE rfq_marketplace;
```

Then configure the required tables using the SQL schema included with the project.

Make sure MySQL is running locally.

---

# 3. Setup Backend

Move into the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rfq_marketplace

JWT_SECRET=your_secret_key
```

Use your own MySQL credentials and a strong JWT secret.

Start the development server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

# 4. Setup Frontend

Open another terminal.

From the project root:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Configure the frontend API URL according to the environment configuration used by the current frontend.

Start the development server:

```bash
npm run dev
```

The frontend should then be available at the URL shown by Vite, usually:

```text
http://localhost:5173
```

---

# 5. Test the Application

A complete test can be performed using the following workflow.

## Buyer Flow

```text
1. Signup as Buyer
2. Login
3. Open Buyer Dashboard
4. Create an RFQ
5. View the RFQ
6. Edit/manage the RFQ
7. Wait for supplier quotation
8. View received quotation
```

## Supplier Flow

```text
1. Signup as Supplier
2. Login
3. Open Supplier Dashboard
4. Browse RFQs
5. Search/filter RFQs
6. Open an RFQ
7. Submit quotation
8. Open My Quotations
9. Verify submitted quotation
```

## Complete Marketplace Test

The most important end-to-end test is:

```text
Buyer creates RFQ
        ↓
Supplier discovers RFQ
        ↓
Supplier submits quotation
        ↓
Buyer views quotation
```

This confirms that authentication, authorization, API communication and database persistence are working together.

---

# Deployment

The application is designed to be deployed as a production web application with:

```text
React Frontend
      ↓
Express Backend
      ↓
MySQL Database
```

Environment variables should be configured through the hosting provider instead of committing production secrets to GitHub.

For production deployment, update:

* Frontend API URL
* Backend CORS configuration
* Database credentials
* JWT secret
* Production environment variables

---

# Assumptions

The following assumptions were made to keep the project focused and aligned with the assignment:

1. An RFQ is created by a single buyer.
2. Suppliers can submit quotations to open RFQs.
3. The marketplace does not process payments.
4. Quotations are informational offers rather than legally binding purchase orders.
5. A simple search/filter implementation is sufficient for the scale of this mini marketplace.
6. MySQL is used as the persistent relational database.
7. Authentication is handled using JWT.
8. Users have exactly one role: either Buyer or Supplier.

---

# Current Limitations

This is intentionally a mini RFQ marketplace rather than a full enterprise procurement platform.

Current limitations include:

* No payment processing
* No real-time notifications
* No email notifications
* No supplier verification system
* No file/document attachments
* No advanced full-text search
* No quotation negotiation workflow
* No purchase order generation
* No messaging/chat system
* No advanced analytics
* No admin dashboard

These features were intentionally excluded to keep the implementation focused on the core assignment requirements.

---

# Future Improvements

The application can be extended in several directions.

## 1. Notifications

Add email or in-app notifications for:

* New RFQ
* New quotation
* RFQ deadline approaching
* RFQ status changes

## 2. Supplier Profiles

Suppliers could maintain profiles containing:

```text
Company Name
Business Description
Industry
Location
Contact Information
Previous Work
```

## 3. File Attachments

Allow buyers to attach:

* Product specifications
* Requirement documents
* Images
* PDFs

Suppliers could then review these documents before submitting quotations.

## 4. Advanced Search

For a larger marketplace, search could be improved using:

* Full-text search
* Product categories
* Location-based filtering
* Price ranges
* Deadline filters

## 5. Quotation Management

A more advanced workflow could support:

```text
Submitted
   ↓
Under Review
   ↓
Accepted / Rejected
```

## 6. Messaging

Buyer and supplier messaging could be added for clarification and negotiation.

## 7. Admin Dashboard

An administrator could manage:

* Users
* RFQs
* Suppliers
* Reported content
* Marketplace statistics

## 8. Analytics

Dashboards could show:

* Number of RFQs
* Active RFQs
* Quotations received
* Average quotation value
* Supplier activity
* Buyer activity

---

# Engineering Decisions

The project intentionally follows a few principles:

### Keep the architecture simple

The application uses a straightforward client-server architecture instead of introducing unnecessary microservices or infrastructure.

### Validate at the backend

Frontend validation improves user experience, but the backend remains responsible for validating incoming requests because frontend validation cannot be trusted for security.

### Protect both authentication and authorization

Being logged in does not automatically mean a user can access every resource.

For example:

```text
Authenticated Supplier
       ≠
Permission to edit another user's RFQ
```

### Use a relational database

The RFQ marketplace has clear relationships between:

```text
Users
RFQs
Quotations
```

MySQL is therefore a natural fit for the application's data model.

### Focus on the core workflow

The project prioritizes:

```text
Authentication
       ↓
RFQ Creation
       ↓
RFQ Discovery
       ↓
Quotation Submission
       ↓
Quotation Review
```

rather than adding features that aren't necessary for the core marketplace.

---

# Project Goals

The primary goal of this project is to demonstrate practical software engineering ability through a complete, working application.

The project focuses on:

* Clean and understandable code
* REST API design
* Relational database design
* Authentication
* Role-based authorization
* Input validation
* Error handling
* Responsive frontend development
* Persistent data
* Maintainable architecture
* Deployment readiness

The application is intentionally small enough to understand end-to-end while still demonstrating the core concepts required to build a real B2B marketplace.

---

# License

This project was created as a software engineering assignment and demonstration project.
