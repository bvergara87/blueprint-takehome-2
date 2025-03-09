# Blueprint Clinical Assessment Application

A fullstack web application for administering clinical assessments, built with React, Styled Components, Express, NestJS, and Supabase Postgres, deployed on Fly.io

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
- Fly.io (deployment)

### Backend

- NestJS 10
- Express
- TypeScript
- Supabase (PostgreSQL database with service role access)

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
│   │   ├── interfaces/      # Types
│   │   ├── dtos/            # Data Transfer Objects for Validation
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

## Technical Reasoning.

I chose to build the application using the same stack that Blueprint is written in.

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

## Additional Features

Obviously this is a microcosm of the actual Blueprint architecture and does not contain some of the more robust features on the Blueprint platform (audio message upload and transcription).

If I were to implement a solution for uploading audio files and transcribe as described in the Blueprint product offering, I would build an architecture to upload audio files into small chunks (5s in length, ordered using some chunk sequence e.g. {userId}-{sessionId}-{chunkId}) to our backend server (would need to have a load balancer and horizontal scaling depending on the traffic and geolocation of requests) then stitch said audio files together as they come in then proceed with transcription. A queue-based service like AWS SQS would make sense to decouple upload operations vs transcription operations, and the transcription itself should live in a separate self-contained Lambda function which can scale as needed.

Some considerations would be cost of spinning up various server instances in different locations around the world but as a system, we would want to prioritize consistency in my opinion (we can have the audio files stored in the client if the upload service is overloaded) but we want to make sure that the audio files are in the correct order and transcribed correctly.

## Migration Path to Production Architecture

For a production-grade application supporting significant scale, I would do the following:

1. **Database Migration**:

   - Migrate from Supabase to AWS RDS for better scaling and enterprise features
   - Implement read replicas and auto-scaling for high availability
   - Use AWS Secrets Manager for more secure credential management
   - Add database indexes on frequently queried fields
   - Implement connection pooling for efficient database connections
   - Consider read replicas for high-traffic deployments
   - Set up query caching for frequently accessed data
   - Implement database partitioning for large-scale deployments
   - Regular database vacuuming and maintenance

2. **Hosting Infrastructure**:

   - Transition from Fly.io to AWS ECS/EKS for container orchestration
   - Implement AWS Application Load Balancer for sophisticated request routing
   - Leverage AWS Auto Scaling Groups for dynamic capacity management
   - Deploy across multiple availability zones for high availability

3. **Security Enhancements**:

   - Replace Supabase Auth with Amazon Cognito or an enterprise identity provider
   - Separate User access by roles
   - Utilize AWS Shield for DDoS protection
   - Add JWT verification middleware to protect API endpoints
   - Implement session management and token refresh logic
   - Replace service role key with JWT auth in client-server communication
   - Add input validation and sanitization for all endpoints
   - Set up security headers (CSP, CORS, HSTS, etc.)

4. **Monitoring and Operations**:

   - Replace basic logging with AWS CloudWatch for comprehensive monitoring
   - Set up CloudWatch Alarms for automated incident response
   - Establish AWS Backup for comprehensive backup strategy

5. **Architecture Evolution**:

   - Decompose monolith into microservices using AWS Lambda and API Gateway
   - Implement event-driven architecture using AWS EventBridge
   - Adopt AWS Step Functions for complex workflow orchestration
   - Leverage AWS SQS for reliable message processing

6. **Testing & Deployment**:
   - Add comprehensive test coverage with unit, integration, and end-to-end tests
   - Develop a full CI/CD pipeline to prevent manual deployment bypassing the test suite.

## Database Discussion

As Blueprint continues to grow at scale, database management and scaling will be paramount for the end-user experience. Here are some ways that I would improve upon the existing database implementation. This includes a discussion of the patient-provider paradigm and security/access considerations for each role as well as some considerations about HIPAA compliance and consent, PII storage, classification, access and management, and

### Row Level Security (RLS)

The current implementation uses a service role key with full database access. For production:

- Implement RLS policies on all tables to control access based on user identity
- Create separate policies for patients and providers
- Example policy for responses:
  ```sql
  CREATE POLICY "Users can only view their own responses"
  ON responses FOR SELECT
  USING (auth.uid() = user_id);
  ```

### Provider-Patient Relationship Model

In a production application, properly modeling the provider-patient relationship is critical for both workflow functionality and regulatory compliance. Here's how this relationship should be structured:

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

Some other HIPAA and PII/PHI considerations:

- Ensure all PHI is encrypted at rest and in transit
- Implement audit logs for all data access
- Set up BAAs with all service providers
- Develop policies for data retention and deletion
- Regular security risk assessments
- Staff training on data handling procedures
  -Implement field-level encryption for highly sensitive fields (SSN, medical record numbers)
- Mask or Truncate PII when using the applications UI or when a client is screenshotting

## Links

- [MyLessonPal](https://github.com/bvergara87/MyLessonPal)
- [LinkedIn/Resume](https://www.linkedin.com/in/bryant-vergara/)
