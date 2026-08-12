# Deployment Guidelines

## Backend (Render Free Tier)
1. Push your code to a GitHub repository.
2. Log in to [Render](https://render.com).
3. Click "New" -> "Blueprint".
4. Connect your GitHub repository.
5. Make sure the Root Directory is set to `backend` so Render detects the `render.yaml` blueprint.
6. In the dashboard, configure the required Environment Variables:
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
7. Note: The Render free tier goes to sleep after 15 minutes of inactivity. Our Next.js app can optionally hit the `/health` endpoint to wake it up on load.

## Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com).
2. Click "Add New..." -> "Project".
3. Import your GitHub repository.
4. Set the Framework Preset to **Next.js**.
5. Set the Root Directory to `frontend`.
6. Add your Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. **Important**: Before deploying, go to `frontend/src/app/interview/page.tsx` and change `http://localhost:10000/api/evaluate` to your new Render backend URL (e.g. `https://mock-interview-backend.onrender.com/api/evaluate`).
8. Click "Deploy".
