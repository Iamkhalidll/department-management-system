# Departments API

A robust backend API built with NestJS, GraphQL, TypeORM, and PostgreSQL for managing departments and sub-departments with JWT authentication.

## Features

- **Authentication with JWT**
  - Secure login endpoint
  - Protected routes requiring valid JWT tokens

- **Department Management**
  - Create departments with optional sub-departments
  - Read all departments with pagination
  - Update department names
  - Delete departments (cascades to sub-departments)

- **Error Handling**
  - Comprehensive error handling for database errors
  - Network issue handling
  - Detailed logging

- **API Documentation**
  - Swagger UI available at `/api/docs`
  - GraphQL Playground available at `/graphql`

## Tech Stack

- **Backend**: NestJS, TypeScript
- **API**: GraphQL with REST endpoints for documentation
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Render.com

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Yarn
- PostgreSQL database

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/departments-api.git
   cd departments-api
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=departments_db

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Environment
   NODE_ENV=development
   PORT=3000
   ```

4. Run the application:
   ```bash
   # Development mode
   yarn start:dev

   # Production mode
   yarn build
   yarn start:prod
   ```

## API Documentation

### Swagger
Once the application is running, visit `http://localhost:3000/api/docs` to access the Swagger documentation.

### GraphQL Playground
The GraphQL playground is available at `http://localhost:3000/graphql`.

## GraphQL Examples

### Authentication

```graphql
mutation {
  login(input: {
    username: "admin",
    password: "admin123"
  }) {
    access_token
    user {
      id
      username
    }
  }
}
```

### Create Department (without sub-departments)

```graphql
mutation {
  createDepartment(input: {
    name: "Finance"
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

### Create Department (with sub-departments)

```graphql
mutation {
  createDepartment(input: {
    name: "HR",
    subDepartments: [
      { name: "Recruitment" },
      { name: "Training" }
    ]
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

### Get All Departments (with pagination)

```graphql
query {
  getDepartments(page: 1, limit: 10) {
    departments {
      id
      name
      subDepartments {
        id
        name
      }
    }
    total
  }
}
```

### Update Department

```graphql
mutation {
  updateDepartment(input: {
    id: 1,
    name: "Finance & Accounting"
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

### Delete Department

```graphql
mutation {
  deleteDepartment(id: 1)
}
```

## Error Handling

The API includes comprehensive error handling for:
- Database connection issues
- Invalid data submissions
- Authentication failures
- Resource not found errors
- Server errors

Each error returns a standardized response with:
- HTTP status code
- Error message
- Error code
- Stack trace (in development mode only)

## Deployment

### Render.com Deployment

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `yarn install && yarn build`
   - Start Command: `yarn start:prod`
4. Add environment variables (same as in `.env` file)
5. Deploy

## Default Credentials

The application is pre-configured with a default admin user:
- Username: `admin`
- Password: `admin123`

Change these credentials in production.

## License

MIT