# Deployment Guide for Saksham Prasai (EduConsult Pro)

To get your public link, follow these steps:

## 1. Environment Variables
When you deploy on **Railway.app**, you must add these "Variables" in the dashboard for each service:

### For the `backend` service:
- `PORT`: `5000`
- `NODE_ENV`: `production`
- `JWT_SECRET`: `(Make up a long random password)`
- `JWT_REFRESH_SECRET`: `(Make up another long random password)`
- `FRONTEND_URL`: `https://your-frontend-link.up.railway.app` (Railway will give you this)

### For the `frontend` service:
- `NEXT_PUBLIC_API_URL`: `https://your-backend-link.up.railway.app/api`
- `NEXT_PUBLIC_SITE_URL`: `https://your-frontend-link.up.railway.app`

## 2. Public Links
Once deployed, Railway will provide you with two links:
1. **Frontend Link**: This is your **Public User Link** (e.g., `https://edu-consult-pro-production.up.railway.app`). This is what you give to clients.
2. **Backend Link**: Used only for the API.

## 3. Database
Railway will automatically start a PostgreSQL database for you. Ensure the `DATABASE_URL` variable in your backend points to the Railway PostgreSQL service.

## 4. Verification
Once live, visit your "About" page to see your name (**Saksham Prasai**) and your number (**9802481462**) live on the web!
