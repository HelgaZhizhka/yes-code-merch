# Supabase: Working with Two Environments (Staging and Production)

## Architecture

The project uses **two Supabase projects**:

- **Staging** — for development and testing (branch `develop`)
- **Production** — for the live environment (branch `main`)

## Environment Variables

- All keys and project references for each environment are stored in `.env.development` (staging) and `.env.production` (production).
- Do not commit real keys to git! Use GitHub Secrets for CI/CD.

## Local Development

1. Start the local environment:
   ```
   make supabase.start
   ```
2. Make all database changes (tables, functions, policies) through migrations:

   ```
   make supabase.migrations.new name=migration_name
   ```

   or directly via Supabase CLI.

3. Apply migrations locally:
   ```
   make supabase.db.reset
   ```

## Working with Migrations and Deployment

- **Staging**:

  - Push all changes to the `develop` branch.
  - After merging or pull request to `develop`, CI/CD automatically applies migrations to the staging Supabase project and deploys the frontend to the staging Netlify site.
  - Check the results on the staging site and in Supabase Studio.

- **Production**:
  - After testing, create a pull request from `develop` to `main`.
  - After merging to `main`, CI/CD applies migrations to the production Supabase project and deploys the frontend to the production Netlify site.

## Important

- **Always record all database changes only through migrations!** Do not change staging/production manually via UI.
- Deployments and migrations are handled via GitHub Actions and environment variables from Secrets.
- For frontend deployment on Netlify, you need `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` (separate for each environment).

## Troubleshooting

- If something doesn't work — check GitHub Actions logs and Supabase Studio.
- To revert changes, use git revert or reset (see instructions above).
