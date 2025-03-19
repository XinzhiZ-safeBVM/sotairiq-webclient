# Sotair IQ Web Application - Environment Setup Guide

## Setting Up Environment Variables for API Calls

This guide explains how to configure environment variables for API calls in the Sotair IQ web application. The project uses Vite as its build tool, which has specific requirements for environment variable naming and usage.

### Creating Environment Files

1. Create a `.env` file in the root directory of the project (same level as `package.json` and `vite.config.js`).

2. For different environments, you can create:
   - `.env` - Loaded in all environments
   - `.env.local` - Loaded in all environments, ignored by git
   - `.env.development` - Development environment specific (used with `npm run dev`)
   - `.env.production` - Production environment specific (used with `npm run build`)

> **Note:** The `.env`, `.env.local`, and `.env.*.local` files are already included in the `.gitignore` file to prevent committing sensitive information to the repository.

### Required Environment Variables

Based on the current codebase, the following environment variables are required:

```
# API Gateway URL (required)
VITE_API_GATEWAY_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev

# AWS Cognito Configuration (required for authentication)
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_COGNITO_ENDPOINT=https://cognito-idp.us-east-1.amazonaws.com/
VITE_AWS_REGION=us-east-1
```

### Important Notes About Vite Environment Variables

1. **Variable Naming**: All environment variables must be prefixed with `VITE_` to be exposed to your Vite-bundled code. Variables without this prefix will not be available in your application.

2. **Access Pattern**: In your code, access environment variables using `import.meta.env.VARIABLE_NAME` instead of `process.env.VARIABLE_NAME` (which is used in regular Node.js applications).

3. **Type**: All environment variables are strings in the final app.

4. **Build Time**: Environment variables are embedded during build time. They cannot be changed after the application is built.

### Example Usage in Code

The environment variables are used in the following files:

#### `src/services/httpClient.js`

```javascript
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev'
});
```

#### `src/services/authService.js`

```javascript
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const COGNITO_ENDPOINT = import.meta.env.VITE_COGNITO_ENDPOINT || 'https://cognito-idp.us-east-1.amazonaws.com/';
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';
```

#### `src/services/apiService.js`

```javascript
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';
```

### Best Practices

1. **Never commit sensitive information**: Keep your `.env` files out of version control. The project's `.gitignore` already excludes these files.

2. **Provide examples**: Create a `.env.example` file with dummy values that can be committed to the repository to show other developers what environment variables are needed.

3. **Use defaults wisely**: Provide sensible defaults for non-sensitive configuration as fallbacks in your code, as shown in the examples above.

4. **Document required variables**: Keep this README updated with any new environment variables that are added to the project.

### Local Development Setup

1. Copy the environment variable template below into a new file named `.env.local` in the project root.

2. Replace the placeholder values with your actual API endpoints and credentials.

3. Start the development server with `npm run dev`.

```
# API Gateway URL
VITE_API_GATEWAY_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev

# AWS Cognito Configuration
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_COGNITO_ENDPOINT=https://cognito-idp.us-east-1.amazonaws.com/
VITE_AWS_REGION=us-east-1
```

### Troubleshooting

- **Variables not accessible**: Ensure they are prefixed with `VITE_`
- **Changes not reflected**: Restart the development server after changing environment variables
- **Production issues**: Verify that you've set the correct variables in your production environment or `.env.production` file before building