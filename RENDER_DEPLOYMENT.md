# Deploying to Render.com

This guide explains how to deploy the Departments API to Render.com.

## Prerequisites

- A [Render.com](https://render.com/) account
- Your project code in a GitHub repository

## Steps to Deploy

### 1. Set Up a PostgreSQL Database

1. Log in to your Render.com account
2. Navigate to the Dashboard
3. Click "New" and select "PostgreSQL"
4. Configure your PostgreSQL instance:
   - Name: `departments-db` (or your preferred name)
   - Database: `departments_db`
   - User: Leave as auto-generated
   - Region: Choose the region closest to your users
   - PostgreSQL Version: 15
5. Click "Create Database"
6. Once created, take note of the following from the database info page:
   - Internal Database URL
   - External Database URL
   - User
   - Password

### 2. Deploy the Web Service

1. From the Render.com dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `departments-api` (or your preferred name)
   - Environment: Node
   - Region: Choose the same region as your database
   - Branch: main (or your default branch)
   - Build Command: `yarn install && yarn build`
   - Start Command: `yarn start:prod`
   - Instance Type: Choose based on your needs (Free tier works for testing)

4. Under "Environment Variables", add all the variables from your `.env` file:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=[Your Render PostgreSQL Internal Host]
   DB_PORT=5432
   DB_USERNAME=[Your Render PostgreSQL Username]
   DB_PASSWORD=[Your Render PostgreSQL Password]
   DB_DATABASE=departments_db
   JWT_SECRET=[Your Secret Key]
   ```

5. Click "Create Web Service"

6. Wait for the deployment to complete (5-10 minutes for the first deploy)

### 3. Test Your Deployment

1. Once deployed, Render will provide you with a URL for your web service (e.g., `https://departments-api.onrender.com`)
2. Test the API with the following endpoints:
   - Swagger Documentation: `https://departments-api.onrender.com/api/docs`
   - GraphQL Playground: `https://departments-api.onrender.com/graphql`

### 4. Troubleshooting

If you encounter issues:

1. Check the Logs section in your Render dashboard for error messages
2. Verify your environment variables
3. Ensure the database is properly connected (check the connection string)
4. Make sure you've set `NODE_ENV=production`

### 5. Setting Up Continuous Deployment

By default, Render will automatically redeploy your application when you push changes to your configured branch.

## Additional Configuration

### Custom Domains

1. In your Web Service settings, go to the "Settings" tab
2. Scroll to "Custom Domain"
3. Click "Add Custom Domain" and follow the instructions

### Monitoring and Scaling

- Monitor your application's performance in the Render dashboard
- Scale up your instance type if needed as your application grows