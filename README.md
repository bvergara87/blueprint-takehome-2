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

- React 18
- React Router 6
- Styled Components 6
- TypeScript
- Parcel 2 (bundler)
- Supabase JavaScript Client

### Backend

- NestJS 10
- Express
- TypeScript
- Supabase (PostgreSQL database with service role access)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm
- Supabase account (free tier available at https://supabase.com)

### Setting up Supabase

1. Create a new Supabase project
2. Copy your Supabase URL and Service Role Key (from Project Settings > API)
3. Update the `.env` file in the server directory with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PASSWORD=your_database_password
SUPABASE_DIRECT_URL=your_direct_database_url
PORT=3000
```

4. Follow the instructions in `SUPABASE_SETUP.md` to configure your database:
   - Create the necessary stored procedures for SQL execution
   - Run the database setup script

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
├── client/                  # Frontend React application
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── server/                  # Backend NestJS application
│   ├── scripts/             # Database setup scripts
│   ├── sql/                 # SQL schema files
│   ├── src/                 # Application source code
│   │   ├── controllers/     # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   └── main.ts          # Application entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
├── SUPABASE_SETUP.md        # Supabase configuration guide
└── README.md                # Project documentation
```

## Database Structure

The application uses Supabase Postgres database with the following tables:

- **domain_mappings**: Maps question IDs to their respective domains
- **assessment_criteria**: Stores thresholds and assessment types for each domain
- **screeners**: Stores the screener questionnaires
- **responses**: Stores patient responses and assessment results

## Production Deployment Considerations

For a production deployment of this application, several critical enhancements should be made:

### Security Enhancements

#### Row Level Security (RLS)

The current implementation uses a service role key with full database access. For production:

- Implement RLS policies on all tables to control access based on user identity
- Create separate policies for patients and providers
- Example policy for responses:
  ```sql
  CREATE POLICY "Users can only view their own responses"
  ON responses FOR SELECT
  USING (auth.uid() = user_id);
  ```

#### User Authentication

- Implement Supabase Auth for secure user authentication
- Set up email/password, social login, and/or SSO options
- Create separate user roles (patient, provider, admin)
- Add JWT verification middleware to protect API endpoints
- Implement session management and token refresh logic

#### API Security

- Replace service role key with JWT auth in client-server communication
- Implement rate limiting to prevent abuse
- Add input validation and sanitization for all endpoints
- Use HTTPS for all connections with proper certificate management
- Set up security headers (CSP, CORS, HSTS, etc.)

### Provider-Patient Relationship Model

In a production healthcare application, properly modeling the provider-patient relationship is critical for both workflow functionality and regulatory compliance. Here's how this relationship should be structured:

#### User Database Model

The current implementation doesn't include a formal user model. For production, we would implement:

```
users
├── id (UUID, PK)
├── auth_id (FK to Supabase auth.users)
├── email (unique)
├── first_name
├── last_name
├── phone_number
├── user_type (enum: 'patient', 'provider', 'admin')
├── created_at
└── updated_at
```

This table would serve as the base for both patients and providers using a polymorphic relationship pattern.

#### Patient Profile

```
patients
├── id (UUID, PK)
├── user_id (FK to users table)
├── date_of_birth
├── address
├── emergency_contact
├── insurance_information
├── medical_record_number (unique)
├── status (active, inactive)
└── metadata (JSONB for extensibility)
```

#### Provider Profile

```
providers
├── id (UUID, PK)
├── user_id (FK to users table)
├── npi_number (National Provider Identifier)
├── specialties (array of specialties)
├── credentials (MD, PhD, etc.)
├── provider_type (psychiatrist, psychologist, etc.)
├── availability (JSONB)
└── metadata (JSONB for extensibility)
```

#### Provider-Patient Relationship

```
provider_patient_relationships
├── id (UUID, PK)
├── provider_id (FK to providers)
├── patient_id (FK to patients)
├── relationship_type (primary provider, consulting, etc.)
├── start_date
├── end_date (null if active)
├── status (active, inactive, suspended)
├── created_at
└── updated_at
```

#### Assessment Assignment and Sharing

```
assessment_assignments
├── id (UUID, PK)
├── provider_id (FK to providers)
├── patient_id (FK to patients)
├── screener_id (FK to screeners)
├── status (assigned, completed, reviewed)
├── assigned_at
├── completed_at
├── notes
└── reminder_settings (JSONB)
```

```
assessment_results
├── id (UUID, PK)
├── assignment_id (FK to assessment_assignments)
├── response_id (FK to responses)
├── provider_notes (private notes for providers)
├── shared_notes (notes shared with patient)
├── reviewed_at
├── shared_with_patient (boolean)
└── shared_at
```

#### Access Control Implementation

For the provider-patient relationship, Row Level Security would be implemented as follows:

1. **Base access policy for users**:

   ```sql
   -- Users can only access their own data
   CREATE POLICY "Users can view and edit their own data"
   ON users
   USING (auth.uid() = auth_id);
   ```

2. **Providers accessing patient data**:

   ```sql
   -- Providers can access data for their patients
   CREATE POLICY "Providers can access their patients' data"
   ON patients
   USING (
     EXISTS (
       SELECT 1 FROM provider_patient_relationships ppr
       JOIN providers p ON p.id = ppr.provider_id
       JOIN users u ON u.id = p.user_id
       WHERE ppr.patient_id = patients.id
       AND u.auth_id = auth.uid()
       AND ppr.status = 'active'
     )
   );
   ```

3. **Assessment result access**:
   ```sql
   -- Patients can only see shared results
   CREATE POLICY "Patients can view their shared assessment results"
   ON assessment_results
   FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM assessment_assignments aa
       JOIN patients p ON p.id = aa.patient_id
       JOIN users u ON u.id = p.user_id
       WHERE aa.id = assessment_results.assignment_id
       AND u.auth_id = auth.uid()
       AND assessment_results.shared_with_patient = true
     )
   );
   ```

#### Workflows

In a production application, the provider-patient relationship would enable specific workflows:

1. **Provider Dashboard**:

   - View all assigned patients
   - Monitor assessment completion status
   - Review assessment results
   - Assign new assessments to patients

2. **Patient Dashboard**:

   - View assigned providers
   - See pending assessments
   - Access shared assessment results
   - Request appointments based on assessment results

3. **Assessment Assignment**:

   - Providers can assign specific screeners to patients
   - Automated reminders for incomplete assessments
   - Option to schedule recurring assessments

4. **Result Sharing**:
   - Providers review results before sharing with patients
   - Ability to add contextual notes to results
   - Optional notification system when results are shared

#### Consent Management

For HIPAA compliance, the system should include consent management:

```
consent_records
├── id (UUID, PK)
├── patient_id (FK to patients)
├── consent_type (treatment, data_sharing, research)
├── status (granted, revoked)
├── granted_at
├── expires_at
├── revoked_at
├── document_version
└── consent_document_url
```

This structured approach to the provider-patient relationship ensures proper data access controls, supports clinical workflows, and maintains compliance with healthcare regulations.

### HIPAA Compliance (for healthcare data)

- Ensure all PHI is encrypted at rest and in transit
- Implement audit logs for all data access
- Set up BAAs with all service providers
- Develop policies for data retention and deletion
- Regular security risk assessments
- Staff training on data handling procedures

### PII and Protected Health Information Management

Managing Personally Identifiable Information (PII) and Protected Health Information (PHI) requires special consideration in healthcare applications:

#### Data Classification

Implement a robust data classification system:

1. **Identifying PII/PHI in the system**:

   - Direct identifiers: Names, addresses, phone numbers, emails, SSNs, medical record numbers
   - Indirect identifiers: Dates of birth, admission dates, zip codes
   - Health information: Diagnoses, treatments, medication records, assessment results

2. **Classification levels**:
   ```
   data_classification_policies
   ├── data_type (enum: 'direct_identifier', 'indirect_identifier', 'health_information')
   ├── sensitivity_level (enum: 'low', 'medium', 'high', 'restricted')
   ├── retention_period (days)
   ├── encryption_required (boolean)
   ├── masking_required (boolean)
   └── access_restrictions (JSONB)
   ```

#### Technical Implementation for PII Protection

1. **Data encryption strategy**:

   - Implement field-level encryption for highly sensitive fields (SSN, medical record numbers)
   - Use different encryption keys for different data types
   - Rotate encryption keys regularly

2. **Data masking and anonymization**:

   ```sql
   -- Example function to mask PII in database views
   CREATE OR REPLACE FUNCTION mask_pii(
     value TEXT,
     data_type TEXT,
     user_role TEXT
   ) RETURNS TEXT AS $$
   BEGIN
     IF user_role = 'admin' THEN
       RETURN value;
     ELSIF data_type = 'ssn' THEN
       RETURN 'XXX-XX-' || RIGHT(value, 4);
     ELSIF data_type = 'email' THEN
       RETURN LEFT(value, 2) || 'XXXX@' || SPLIT_PART(value, '@', 2);
     ELSE
       RETURN value;
     END IF;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

3. **Patient de-identification**:
   - Implement HIPAA Safe Harbor method for de-identified datasets
   - Create separate views with automatically masked PII for research and analytics
   - Establish protocols for minimum necessary access

#### Access Controls for PII

1. **Granular permission system**:

   ```
   role_permissions
   ├── role_id
   ├── resource_type (table name)
   ├── field_name
   ├── permission_type (view, edit, delete)
   ├── can_view_pii (boolean)
   └── requires_justification (boolean)
   ```

2. **Access justification and audit**:
   ```
   access_justifications
   ├── access_id (PK)
   ├── user_id
   ├── patient_id
   ├── resource_accessed
   ├── justification_reason
   ├── access_time
   ├── ip_address
   └── session_id
   ```

#### Regulatory Compliance Features

1. **Patient rights management**:

   - Right to access: Allow patients to download their complete records
   - Right to correct: Implement correction request workflow
   - Right to delete: Support data deletion requests within regulatory constraints

2. **Consent management extensions**:

   - Granular consent options for specific data usage
   - Consent withdrawal tracking
   - Age-appropriate consent handling (minors vs. adults)

#### Data Minimization and Lifecycle

1. **Data collection principles**:

   - Collect only necessary information (purpose limitation)
   - Use pseudonymization where possible
   - Implement separate storage for identifiers and clinical data

2. **Retention and deletion**:

   ```sql
   -- Automated data retention policy
   CREATE OR REPLACE FUNCTION apply_retention_policy() RETURNS void AS $$
   BEGIN
     -- Anonymize data older than retention period
     UPDATE patients
     SET
       first_name = 'REDACTED',
       last_name = 'REDACTED',
       email = NULL,
       phone_number = NULL
     WHERE last_activity_date < NOW() - INTERVAL '7 years'
     AND status = 'inactive';

     -- Mark for complete deletion after extended period
     UPDATE patients
     SET marked_for_deletion = TRUE
     WHERE last_activity_date < NOW() - INTERVAL '10 years'
     AND status = 'inactive';
   END;
   $$ LANGUAGE plpgsql;
   ```

### Scaling and Performance

#### Database Performance

- Add database indexes on frequently queried fields
- Implement connection pooling for efficient database connections
- Consider read replicas for high-traffic deployments
- Set up query caching for frequently accessed data
- Implement database partitioning for large-scale deployments
- Regular database vacuuming and maintenance

#### Application Scaling

- Deploy to a cloud provider with auto-scaling capabilities
- Implement containerization with Docker and Kubernetes
- Set up load balancing for horizontal scaling
- Use CDN for static assets delivery
- Implement server-side caching with Redis
- Consider serverless functions for specific API endpoints

### Reliability and Monitoring

- Set up comprehensive application logging
- Implement distributed tracing for request flows
- Configure monitoring dashboards with Grafana/Datadog
- Set up alerts for critical issues and performance degradation
- Regular database backups with point-in-time recovery
- Implement health checks and automated recovery
- Set up CI/CD pipelines for reliable deployments

### Architecture Improvements

- Migrate to a microservices architecture for better scaling
- Implement a message queue (Kafka or the like) for async operations
- Add a separate analytics service for reporting
- Consider using an API gateway for better request routing
- Add WebSockets for real-time features
- Implement service worker for offline capabilities

### Frontend Optimizations

- Server-side rendering for improved SEO and performance
- Code splitting and lazy loading for faster initial load
- Implement a robust state management solution (Redux/Zustand)
- Add comprehensive error boundaries and fallback UIs
- Optimize bundle size with tree shaking

## Trade-offs and Future Improvements

### Architecture and Technology Trade-offs

#### Database: Supabase vs. Enterprise Solutions

For this application, I chose Supabase Postgres as our database solution, which offers several advantages:

- **Rapid Development**: Supabase provided a user-friendly interface and built-in APIs that accelerated our initial development
- **Postgres Foundation**: Leverages the reliability and features of PostgreSQL while adding developer-friendly abstractions
- **Built-in Auth**: Simplified authentication system that integrates directly with the database
- **Real-time Capabilities**: Native support for real-time updates without additional infrastructure
- **Cost-effective**: Low starting costs with a generous free tier for development

However, compared to enterprise solutions like AWS RDS, Supabase has limitations:

- **Limited Scaling Options**: Fewer options for vertical and horizontal scaling compared to AWS RDS
- **Less Control**: Limited infrastructure customization options compared to self-hosted solutions
- **Operational Maturity**: Newer platform with less mature operational tooling than established providers
- **Ecosystem Integration**: More limited integration with broader cloud service ecosystems
- **Enterprise SLAs**: Less comprehensive SLAs and support options for mission-critical applications

#### Hosting: Fly.io vs. AWS

We deployed the application on Fly.io, which provided these benefits:

- **Developer Experience**: Simplified deployment workflow with automatic global distribution
- **Edge Deployment**: Low-latency hosting with servers close to users worldwide
- **Simple Configuration**: Infrastructure-as-code with minimal configuration
- **Cost Efficiency**: Pay-per-use pricing model with lower baseline costs than equivalent AWS services
- **Automatic SSL**: Built-in SSL certificate management and provisioning

In contrast, a more robust AWS implementation would offer:

- **Ecosystem Breadth**: Access to 200+ integrated services for every possible requirement
- **Compliance Certifications**: More comprehensive compliance certifications for regulated industries
- **Enterprise Support**: Multiple tiers of enterprise support with dedicated technical account managers
- **Advanced Networking**: More sophisticated networking controls, VPC options, and security features
- **Scalability Ceiling**: Practically unlimited scaling potential for high-traffic applications

#### Full-stack Trade-offs

The current architecture makes several opinionated choices that prioritize development speed:

- **NestJS/React Stack**: Chose modern TypeScript frameworks that support rapid development but requires specialized knowledge compared to more common stacks
- **Service Role Access**: Using Supabase service role for simplicity rather than implementing proper JWT-based auth flow
- **Monolithic Structure**: Single codebase rather than microservices for simplicity, with corresponding scaling limitations
- **Limited Test Coverage**: Prioritized feature development over comprehensive testing infrastructure
- **Manual Deployment**: Simple deployment process without CI/CD pipelines or automated testing

### Migration Path to Enterprise Architecture

For a production-grade application supporting significant scale, we would recommend:

1. **Database Migration**:

   - Migrate from Supabase to AWS RDS for better scaling and enterprise features
   - Implement read replicas and auto-scaling for high availability
   - Use AWS Secrets Manager for more secure credential management

2. **Hosting Infrastructure**:

   - Transition from Fly.io to AWS ECS/EKS for container orchestration
   - Implement AWS Application Load Balancer for sophisticated request routing
   - Leverage AWS Auto Scaling Groups for dynamic capacity management
   - Deploy across multiple availability zones for high availability

3. **Security Enhancements**:

   - Replace Supabase Auth with Amazon Cognito or an enterprise identity provider
   - Implement AWS WAF for advanced request filtering and protection
   - Utilize AWS Shield for DDoS protection
   - Deploy through AWS CloudFormation for infrastructure as code

4. **Monitoring and Operations**:

   - Replace basic logging with AWS CloudWatch for comprehensive monitoring
   - Implement AWS X-Ray for distributed tracing
   - Set up CloudWatch Alarms for automated incident response
   - Establish AWS Backup for comprehensive backup strategy

5. **Architecture Evolution**:
   - Decompose monolith into microservices using AWS Lambda and API Gateway
   - Implement event-driven architecture using AWS EventBridge
   - Adopt AWS Step Functions for complex workflow orchestration
   - Leverage AWS SQS/SNS for reliable message processing

The current architecture represents a pragmatic balance between development speed, cost, and scalability - appropriate for an MVP or moderate-scale application, but would benefit from migration to more robust infrastructure as user adoption grows.

### Additional Future Improvements

- Add comprehensive test coverage with unit, integration, and end-to-end tests
- Implement user authentication with role-based access control
- Enhance UI/UX with animations and more intuitive interactions
- Support offline mode with service workers and local storage
- Add a comprehensive analytics dashboard for providers
