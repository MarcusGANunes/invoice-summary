# Deployment Instructions for Vercel

This guide provides a step-by-step process to configure and deploy this front-end repository on Vercel.

**Prerequisites:**
- An account on [Vercel](https://vercel.com/)
- A PostgreSQL database hosted on Vercel or another hosting service

**1. Fork the Repository:**
- First, fork the repository to your GitHub account.
- Then, connect your GitHub account to your Vercel account to proceed with the deployment.

**2. Project Environment Variables:**
- Generate the NextAuth secret using the following command in your terminal: `openssl rand -base64 32`

- Add the NextAuth to Environment:

  `NEXTAUTH_SECRET=<secret>`
  
  `NEXTAUTH_URL=https://<your-project>.vercel.app`

- Add the PostgreSQL variables with the appropriate values (replace `<information>` with your own data):

  `POSTGRES_PRISMA_URL="postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require"`
  
  `POSTGRES_URL_NON_POOLING="postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require&connection_limit=1"`

- Add the hosting variables for the project's backend and frontend:

  `NEXT_PUBLIC_FRONT_BASE_URL=https://<your-project>.vercel.app`
  
  `NEXT_PUBLIC_BACK_BASE_URL=https://<your-backend-api>.com`

**3. Install and Build Commands:**
- Set the install command to `yarn install`.
- Set the build command to `yarn build`.
