# Running the Application

This document provides step-by-step instructions for running the Blueprint Clinical Assessment application.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm (usually comes with Node.js)

## Starting the Server

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Build the application:

```bash
npm run build
```

4. Start the server:

```bash
npm run start:dev
```

The server will start on http://localhost:3000.

## Starting the Client

1. Open a new terminal window

2. Navigate to the client directory:

```bash
cd client
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run start
```

The client application will start and be available at http://localhost:1234.

## Using the Application

1. Open your browser and navigate to http://localhost:1234.
2. You'll be presented with the Blueprint Diagnostic Screener.
3. Answer each question by selecting the appropriate option.
4. After answering all questions, you'll see the recommended assessments based on your responses.
5. You can start over by clicking the "Start Over" button.

## API Endpoints

The server provides the following endpoints:

- `GET /assessments/screener` - Returns the diagnostic screener questionnaire
- `POST /assessments/score` - Accepts answers and returns recommended assessments

Example POST request to score endpoint:

```json
{
  "answers": [
    {
      "value": 1,
      "question_id": "question_a"
    },
    {
      "value": 0,
      "question_id": "question_b"
    }
    // ... more answers
  ]
}
```

Example response:

```json
{
  "results": ["ASRM", "PHQ-9"]
}
```
