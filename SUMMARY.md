# Project Summary

## Core Features Implemented

1. **Authentication Module**
   - JWT-based authentication
   - User entity with secure password storage
   - Login endpoint
   - Protected routes

2. **Department Management**
   - Create departments with optional sub-departments
   - Read departments with pagination
   - Update departments
   - Delete departments (with cascade to sub-departments)

3. **Sub-Department Management (Bonus)**
   - Support for full CRUD operations on sub-departments

4. **Robust Error Handling**
   - Custom HTTP exception filter
   - Database error handling
   - Network error handling
   - Comprehensive logging

5. **Documentation**
   - Swagger API documentation
   - GraphQL Playground
   - Detailed README with examples
   - Deployment guide for Render.com

## Code Structure

```
departments-api/
├── src/
│   ├── auth/                  # Authentication module
│   ├── departments/           # Departments module
│   ├── sub-departments/       # Sub-departments module (bonus)
│   ├── common/                # Shared resources (filters, decorators)
│   ├── app.module.ts          # Main application module
│   └── main.ts                # Application entry point
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
└── RENDER_DEPLOYMENT.md       # Deployment guide
```

## Technologies Used

- **Framework**: NestJS with TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Environment**: dotenv and @nestjs/config
- **Logging**: NestJS built-in Logger

## Package Dependencies

**Main Dependencies:**
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- @nestjs/graphql, @nestjs/apollo, apollo-server-express, graphql
- @nestjs/typeorm, typeorm, pg
- @nestjs/passport, @nestjs/jwt, passport, passport-jwt
- @nestjs/config, dotenv, joi
- @nestjs/swagger, swagger-ui-express
- bcrypt
- class-validator, class-transformer
- reflect-metadata
- rxjs

**Dev Dependencies:**
- @nestjs/cli, @nestjs/testing, @nestjs/schematics
- TypeScript related: typescript, ts-node, etc.
- Testing: jest, supertest

## Setup Instructions

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Install dependencies: `yarn install`
4. Run the application:
   - Development: `yarn start:dev`
   - Production: `yarn start:prod`
   


## API Endpoints

### GraphQL Endpoints

- `POST /graphql` - GraphQL API endpoint
  - Mutations:
    - `login`
    - `createDepartment`
    - `updateDepartment`
    - `deleteDepartment`
  - Queries:
    - `getDepartments`
    - `department`

### Documentation Endpoints

- `GET /api/docs` - Swagger documentation
- `GET /graphql` - GraphQL Playground

## Authentication

The API uses JWT Bearer token authentication:
1. Call the login mutation to get a token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer your-token-here
   ```

## Error Handling

The API provides standardized error responses:
- HTTP status code
- Error message
- Error code
- Stack trace (in development only)

## Deployment

The project is configured for easy deployment to Render.com:
1. Set up a PostgreSQL database on Render
2. Create a Web Service linked to your GitHub repository
3. Configure environment variables
4. Deploy

See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.