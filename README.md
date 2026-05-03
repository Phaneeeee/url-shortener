# URLSpace - Full Stack URL Shortener

A production-deployed URL shortener built with React, FastAPI, PostgreSQL, and AWS. The app lets users create short links, choose optional custom short codes, copy generated links, redirect visitors, and track click counts.

## Live Demo

- Frontend: https://main.d1o6mtelt6huup.amplifyapp.com
- Short link domain: https://urlspace.online
- API docs: https://urlspace.online/docs

## Features

- Shorten long URLs into clean custom links
- Create optional custom short codes
- Redirect short URLs to original destinations
- Track click counts for each short link
- Responsive frontend UI
- Light and dark theme toggle
- Custom domain for production short links
- Environment-based deployment configuration

## Tech Stack

### Frontend

- React
- CSS
- AWS Amplify Hosting

### Backend

- FastAPI
- SQLAlchemy
- Mangum
- AWS Lambda
- Amazon API Gateway

### Database

- PostgreSQL
- Amazon RDS

### Deployment

- AWS Lambda for serverless backend execution
- API Gateway for HTTPS routing
- AWS Amplify for frontend hosting
- Amazon RDS for persistent storage
- Namecheap custom domain connected to API Gateway

## Architecture

```text
User
  |
  | visits frontend
  v
AWS Amplify React App
  |
  | API request
  v
API Gateway custom domain: urlspace.online
  |
  v
AWS Lambda FastAPI backend
  |
  v
Amazon RDS PostgreSQL
```

## API Endpoints

### Create Short URL

```http
POST /shorten
```

Request:

```json
{
  "url": "https://example.com",
  "custom_code": "example"
}
```

Response:

```json
{
  "short_url": "https://urlspace.online/example"
}
```

### Redirect Short URL

```http
GET /{short_code}
```

Redirects the user to the original URL and increments the click counter.

### Get Link Stats

```http
GET /stats/{short_code}
```

Response:

```json
{
  "original_url": "https://example.com",
  "short_code": "example",
  "clicks": 5
}
```

## Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Set environment variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener
BASE_URL=http://127.0.0.1:8000
CORS_ORIGIN=http://localhost:3000
```

Run the backend:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Optional frontend environment variable:

```bash
REACT_APP_API_URL=http://127.0.0.1:8000
```

## Deployment Notes

The backend is configured with environment variables so it can run locally or on AWS Lambda:

- `DATABASE_URL` - PostgreSQL connection string
- `BASE_URL` - public backend domain used when generating short links
- `CORS_ORIGIN` - allowed frontend origin

The frontend uses:

- `REACT_APP_API_URL` - public backend API domain

## What I Learned

- Building REST APIs with FastAPI
- Connecting a React frontend to a Python backend
- Using PostgreSQL with SQLAlchemy
- Deploying FastAPI on AWS Lambda using Mangum
- Configuring API Gateway with a custom domain
- Managing CORS between frontend and backend deployments
- Hosting a React app with AWS Amplify
- Connecting a Namecheap domain to AWS services

## Future Improvements

- Add Redis caching for faster redirects
- Add user authentication
- Add dashboard analytics
- Add QR code generation
- Add link expiration
- Add rate limiting
- Add automated backend deployment pipeline

## Resume Summary

Built and deployed a full-stack URL shortener using React, FastAPI, PostgreSQL, AWS Lambda, API Gateway, RDS, and Amplify. Implemented custom short codes, redirect handling, click analytics, light/dark UI, environment-based configuration, and a custom short-link domain.

## Author

Made by Phaneendra Peravarapu
