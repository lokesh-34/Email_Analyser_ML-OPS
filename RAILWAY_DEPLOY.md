# Railway Deployment Guide

This repository deploys as two Railway services:

- backend from `FastAPI/`
- frontend from `frontend/`

## 1) Prerequisites

- Railway account and project
- GitHub repository connected to Railway

## 2) Deploy backend service

1. In Railway, create a new service from your GitHub repo.
2. Set **Root Directory** to `FastAPI`.
3. Railway will use `FastAPI/Dockerfile` and `FastAPI/railway.json`.
4. Add environment variable:
   - `PORT` = `8000` (optional; Railway provides one automatically)
5. Deploy.
6. Copy backend public URL, for example:
   - `https://your-backend.up.railway.app`

## 3) Deploy frontend service

1. Create another service from the same repo.
2. Set **Root Directory** to `frontend`.
3. Railway will use `frontend/Dockerfile` and `frontend/railway.json`.
4. Add environment variable:
   - `VITE_API_BASE_URL` = your backend public URL, for example `https://your-backend.up.railway.app`
5. Deploy.

## 4) Verify

- Backend health: `https://your-backend.up.railway.app/health`
- Frontend app: open your frontend Railway URL and run a classification.

## Notes

- Frontend reads `VITE_API_BASE_URL` at container startup via `/env-config.js`, so API URL can be changed without rebuilding source code.
- CORS is already open in backend (`allow_origins=["*"]`) for deployment flexibility.
- For local docker compose, frontend can still use `http://localhost:8000`.
