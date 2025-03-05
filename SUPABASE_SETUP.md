# Supabase Setup Guide

This guide walks you through setting up Supabase for the Blueprint Clinical Assessment application.

## Creating a Supabase Project

1. Sign up or log in at [Supabase](https://supabase.com/)
2. Create a new project by clicking the "New Project" button
3. Enter a name for your project (e.g., "blueprint-assessment")
4. Set a secure password for your database
5. Choose a region closest to your users
6. Click "Create new project"

## Getting Your API Credentials

1. Once your project is created, go to the project dashboard
2. Navigate to "Project Settings" (gear icon) > "API"
3. You'll see two keys:

   - `anon` / `public`: This is your public API key
   - `service_role`: This is for server-side operations

4. Copy the URL and the `anon` key to use in your `.env` file:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_API_KEY=your-anon-key
   ```

## Setting Up a Stored Procedure for SQL Execution

Since Supabase doesn't allow direct SQL execution via the JavaScript client, we need to create a stored procedure to execute our SQL commands:

1. Go to the "SQL Editor" in your Supabase dashboard
2. Create a new query and paste the following SQL:

```sql
-- Create a function to execute SQL commands
CREATE OR REPLACE FUNCTION exec_sql(sql_commands text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_commands;
END;
$$;
```

3. Click "Run" to create the function

## Initializing the Database

1. Make sure your `.env` file is correctly set up with your Supabase credentials
2. Run the database setup script:
   ```bash
   cd server
   npm run db:setup
   ```

This script will:

- Create the required tables (domain_mappings, assessment_criteria, screeners, responses)
- Populate the tables with initial data from the JSON files

## Verifying the Setup

1. Go to the "Table Editor" in your Supabase dashboard
2. You should see the following tables:

   - `domain_mappings` (with 8 rows)
   - `assessment_criteria` (with 4 rows)
   - `screeners` (with 1 row)
   - `responses` (initially empty)

3. Check each table to ensure the data has been properly loaded

## Using the Database with the Application

The application is now configured to:

- Read domain mappings, assessment criteria, and screener data from the database
- Store patient responses and recommended assessments
- Provide API endpoints for retrieving and scoring assessments

## Troubleshooting

If you encounter any issues:

1. Check the logs in the terminal where you ran the setup script
2. Verify your Supabase credentials in the `.env` file
3. Make sure the `exec_sql` function was created successfully
4. Check your Supabase project's database logs for errors

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [NestJS Documentation](https://docs.nestjs.com/)
