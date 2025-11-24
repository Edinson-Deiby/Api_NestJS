<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">GPS Backend API</h1>

<p align="center">
  A robust and scalable REST API built with <a href="https://nestjs.com/" target="_blank"><strong>NestJS</strong></a> for managing GPS operations including user authentication, role-based access control, and file uploads.
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-blue.svg" />
  <img alt="License" src="https://img.shields.io/badge/license-UNLICENSED-red.svg" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Testing](#testing)
- [License](#license)

---

## 🎯 Overview

The **GPS Backend API** is a professional-grade REST API designed to power modern GPS applications. It provides comprehensive functionality for user management, authentication, role-based access control, and file uploads. Built with NestJS and TypeORM, it ensures scalability, maintainability, and type safety.

---

## ✨ Features

- **User Management**: Create, read, and update user profiles
- **Authentication**: JWT-based authentication with secure token management
- **Authorization**: Role-based access control (RBAC) with admin and client roles
- **File Uploads**: Secure file upload functionality with server-side storage
- **Database**: MySQL integration with TypeORM for data persistence
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Centralized exception handling with custom filters
- **Testing**: Unit and end-to-end testing with Jest
- **Code Quality**: ESLint and Prettier for code formatting and linting

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | ^11.0.1 | Framework |
| **TypeScript** | ^5.1.0 | Language |
| **TypeORM** | ^0.3.27 | ORM |
| **MySQL** | ^3.15.3 | Database |
| **JWT** | ^11.0.1 | Authentication |
| **Passport** | ^0.7.0 | Authentication Strategy |
| **Bcrypt** | ^6.0.0 | Password Hashing |
| **Jest** | Latest | Testing |
| **ESLint** | ^9.18.0 | Linting |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **MySQL** (v5.7 or higher)
- **Git** (optional, for cloning the repository)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Api_NestJS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Configuration

Create a `.env` file in the root directory with the following variables (optional, as defaults are in `app.module.ts`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=gps_tracking_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=6h
```

---

## ⚙️ Configuration

### Database Configuration

The database connection is configured in `src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'gps_tracking_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
})
```

**Note**: Ensure MySQL is running and the database `gps_tracking_db` exists before starting the application.

### JWT Configuration

JWT settings are configured in `src/auth/jwt/jwt.constants.ts` with a default expiration of **6 hours**.

---

## 🎮 Running the Application

### Development Mode (with hot reload)

```bash
npm run start:dev
```

The server will start at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register a new user | ❌ No |
| `POST` | `/auth/login` | Login and receive JWT token | ❌ No |

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Users Endpoints

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| `GET` | `/users` | Get all users | ✅ Yes | Admin |
| `POST` | `/users` | Create a new user | ❌ No | - |
| `PUT` | `/users/:id` | Update user profile | ✅ Yes | Client |

#### Get All Users (Admin Only)
```bash
GET /users
Authorization: Bearer <jwt_token>
```

#### Create User
```bash
POST /users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Update User
```bash
PUT /users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Roles Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/roles` | Get all available roles |
| `POST` | `/roles` | Create a new role |

---

## 📁 Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── dto/                   # Data transfer objects
│   │   ├── login-auth.dto.ts
│   │   └── register-auth.dto.ts
│   ├── jwt/                   # JWT strategy and guards
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt-roles.guard.ts
│   │   ├── jwt-role.ts
│   │   ├── jwt.constants.ts
│   │   ├── jwt.strategy.ts
│   │   └── has-roles.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── users/                     # Users module
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── configUploads.ts
│
├── roles/                     # Roles module
│   ├── dto/
│   │   └── create-rol.dto.ts
│   ├── rol.entity.ts
│   ├── roles.controller.ts
│   ├── roles.module.ts
│   └── roles.service.ts
│
├── filters/                   # Exception filters
│   └── multer-exception.filter.ts
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts

test/                         # End-to-end tests
uploads/                      # User uploaded files storage
```

---

## 🔐 Authentication

### JWT Bearer Token

Include the JWT token in the `Authorization` header for protected endpoints:

```bash
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control

The API implements role-based access control with the following roles:

- **ADMIN**: Full access to all endpoints
- **CLIENT**: Limited access to user-specific endpoints

### Protected Routes

Endpoints decorated with `@UseGuards(JwtAuthGuard, JwtRolesGuard)` require a valid JWT token and appropriate user role.

---

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:cov
```

### Run End-to-End Tests

```bash
npm run test:e2e
```

---

## 🔧 Additional Commands

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

---

## 📝 Notes

- The `uploads/` directory is automatically created on first run if it doesn't exist
- The server listens on all network interfaces (`0.0.0.0`) on port `3000`
- Database synchronization is enabled in development mode (`synchronize: true`)
- JWT tokens expire after 6 hours by default

---

## 👨‍💼 Author

**Edinson Deiby** - Repository Owner

---

## 📄 License

UNLICENSED
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
