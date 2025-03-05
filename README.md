# Blueprint Clinical Assessment Application

A fullstack web application for administering clinical assessments, built with React, Styled Components, Express, NestJS, and Supabase Postgres.

## Project Overview

This application allows patients to take a diagnostic screener (a questionnaire covering various symptoms) and automatically assigns appropriate assessments based on their responses.

### Features

- Patient-facing UI for completing diagnostic screeners
- Question-by-question navigation with progress tracking
- Backend API for scoring responses and recommending assessments
- Domain-based scoring system
- Persistent storage using Supabase Postgres database

## Technical Stack

### Frontend

- React
- React Router
- Styled Components
- TypeScript
- Parcel (bundler)

### Backend

- NestJS
- Express
- TypeScript
- Supabase (PostgreSQL database)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm
- Supabase account (free tier available at https://supabase.com)

### Setting up Supabase

1. Create a new Supabase project
2. Copy your Supabase URL and API Key (from Project Settings > API)
3. Update the `.env` file in the server directory with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_api_key
```

4. Run the database setup script:

```
cd server
npm run db:setup
```

This will create the necessary tables and populate them with initial data.

### Installation

1. Clone the repository

```
git clone <repository-url>
cd blueprint-takehome-2
```

2. Install dependencies for both client and server

```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers

```
# Start the server (from the server directory)
npm run start:dev

# Start the client (from the client directory)
npm run start
```

4. Open your browser and navigate to `http://localhost:1234` to see the application.

## Project Structure

```
blueprint-takehome-2/
├── client/           # Frontend React application
├── server/           # Backend NestJS application
│   ├── scripts/      # Database setup scripts
│   ├── sql/          # SQL schema files
│   └── src/          # Application source code
└── README.md         # Project documentation
```

## Database Structure

The application uses Supabase Postgres database with the following tables:

- **domain_mappings**: Maps question IDs to their respective domains
- **assessment_criteria**: Stores thresholds and assessment types for each domain
- **screeners**: Stores the screener questionnaires
- **responses**: Stores patient responses and assessment results

## Production Deployment Considerations

### High Availability and Performance

- Deploy to a cloud provider with auto-scaling capabilities
- Implement load balancing
- Use a CDN for static assets
- Implement caching strategies
- Database replication and backups

### Security

- HTTPS for all connections
- Implement proper authentication and authorization
- Input validation and sanitization
- Rate limiting to prevent abuse
- Regular security audits and dependency updates

### Monitoring and Troubleshooting

- Implement comprehensive logging
- Set up application performance monitoring
- Configure alerts for critical issues
- Use distributed tracing for request flows
- Implement health checks

## Trade-offs and Future Improvements

- Currently using file-based storage for simplicity, would migrate to a proper database for production
- Add comprehensive test coverage
- Implement user authentication
- Add more advanced form validation
- Enhance UI/UX with animations and transitions
