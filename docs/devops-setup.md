# DevOps Setup: Environment & CI/CD for Location-Based Content Platform

## 1. Introduction
This document outlines the essential steps for setting up the development environment and implementing Continuous Integration/Continuous Deployment (CI/CD) pipelines for the Location-Based Content Platform. This setup ensures a consistent, efficient, and automated development workflow.

## 2. Local Development Environment Setup

Refer to `docs/tech-stack.md` for detailed instructions on installing core tools. This section provides a consolidated checklist.

### 2.1. Core Tools Installation
*   **Node.js:** Install Node.js 22.x using `nvm`.
    *   `nvm install 22 && nvm use 22 && nvm alias default 22`
    *   Verify: `node -v` and `npm -v`
*   **Firebase CLI:** Install globally.
    *   `npm install -g firebase-tools`
    *   Login: `firebase login` (authenticate with Google account)
    *   Initialize project: `firebase init` (select features: Functions, Firestore, Storage, Hosting)
*   **Git:** Ensure Git is installed and configured.

### 2.2. IDE Configuration (VS Code Recommended)
*   Install recommended VS Code extensions:
    *   ESLint
    *   Prettier
    *   React/React Native Snippets
    *   Firebase Explorer
    *   ES7 React/Redux/GraphQL/React-Native snippets

### 2.3. Cloud Service Access & Configuration
*   **Firebase Project:**
    *   Ensure Firebase project is created and linked to a Google Cloud Project.
    *   Verify billing is enabled (Blaze plan recommended for production).
    *   Enable necessary GCP APIs (e.g., Cloud Functions API, Cloud SQL Admin API).
*   **Cloud SQL (PostgreSQL with PostGIS):**
    *   Create a PostgreSQL instance in Cloud SQL.
    *   Enable PostGIS extension on the database.
    *   Configure **VPC Access** for Cloud Functions to connect to Cloud SQL.
*   **Mapbox:**
    *   Obtain a public Mapbox Access Token (for client-side).
    *   Obtain a secret Mapbox Access Token (for server-side, store securely in Google Secret Manager or Cloud Functions environment variables).
*   **Twilio:**
    *   Create a Twilio account and obtain Account SID and Auth Token.
    *   Store Twilio credentials securely in Cloud Functions environment variables.
*   **Algolia/Elasticsearch:**
    *   Set up an account/instance and obtain API keys.
    *   Store API keys securely in Cloud Functions environment variables.

### 2.4. Environment Variables Management
*   Use Firebase Functions environment configuration for sensitive data:
    *   `firebase functions:config:set mapbox.secret="YOUR_MAPBOX_SECRET_KEY" twilio.sid="YOUR_TWILIO_SID" twilio.token="YOUR_TWILIO_TOKEN" algolia.app_id="YOUR_ALGOLIA_APP_ID" algolia.api_key="YOUR_ALGOLIA_API_KEY"`
    *   Access in functions: `functions.config().service.key`

## 3. Continuous Integration / Continuous Deployment (CI/CD)

The CI/CD pipeline will automate the build, test, and deployment processes, ensuring rapid and reliable delivery.

### 3.1. Tools
*   **Source Control:** GitHub (recommended)
*   **CI/CD Platform:** Google Cloud Build or GitHub Actions (recommended for integration with GitHub)

### 3.2. CI/CD Pipeline Stages

#### 3.2.1. Cloud Functions Pipeline
*   **Trigger:** Push to `main` branch (or `develop` for staging).
*   **Steps:**
    1.  **Linting & Static Analysis:** Run ESLint and other code quality checks.
    2.  **Unit & Integration Tests:** Execute all backend tests.
    3.  **Build:** Transpile Node.js code if necessary.
    4.  **Deployment:** Deploy Cloud Functions to Firebase.
        *   Use `firebase deploy --only functions`
        *   Consider deploying to a staging project first for verification.
    5.  **Post-Deployment Checks:** Basic health checks or smoke tests.

#### 3.2.2. Web PWA Client Pipeline (React/Next.js)
*   **Trigger:** Push to `main` branch (or `develop` for staging).
*   **Steps:**
    1.  **Linting & Static Analysis:** Run ESLint, Prettier.
    2.  **Unit & Component Tests:** Execute frontend tests.
    3.  **Build:** Build the Next.js application for production.
    4.  **Deployment:** Deploy to Firebase Hosting.
        *   Use `firebase deploy --only hosting`
        *   Consider deploying to a staging project first.
    5.  **PWA Audit:** Run Lighthouse CI to ensure PWA best practices are met.

#### 3.2.3. Mobile App Pipeline (React Native - Future)
*   **Trigger:** Push to `main` branch.
*   **Steps:**
    1.  **Linting & Testing:** Run tests.
    2.  **Build:** Build Android APK/AAB and iOS IPA.
    3.  **Code Signing:** Automate code signing.
    4.  **Distribution:** Deploy to Firebase App Distribution for internal testing, then to Google Play Store / Apple App Store.

### 3.3. Example GitHub Actions Workflow (`.github/workflows/deploy-functions.yml`)
```yaml
name: Deploy Firebase Functions

on:
  push:
    branches:
      - main
    paths:
      - 'functions/**' # Trigger only on changes in the functions directory

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Install dependencies
        run: npm install
        working-directory: functions # Assuming functions are in a 'functions' directory

      - name: Deploy Functions
        run: firebase deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }} # Store Firebase token as a GitHub Secret
          # Add other environment variables needed by functions (e.g., Mapbox, Twilio)
          # MAPBOX_SECRET: ${{ secrets.MAPBOX_SECRET }}
          # TWILIO_SID: ${{ secrets.TWILIO_SID }}
          # TWILIO_TOKEN: ${{ secrets.TWILIO_TOKEN }}
```

## 4. Monitoring and Logging

### 4.1. Firebase & GCP Tools
*   **Firebase Crashlytics:** For real-time crash reporting in client applications.
*   **Google Cloud Logging:** Centralized logging for Cloud Functions, database operations, and other GCP services.
    *   Implement structured logging in Cloud Functions.
*   **Google Cloud Monitoring:** For performance metrics, custom dashboards, and alerting (e.g., function errors, latency, database performance).
*   **Firebase Performance Monitoring:** For client-side performance metrics.

## 5. Security Best Practices in DevOps

*   **Secret Management:** Use Google Secret Manager or Firebase Functions environment configuration for all API keys and sensitive credentials. Avoid hardcoding secrets.
*   **Least Privilege:** Grant CI/CD service accounts and Firebase service accounts only the minimum necessary permissions.
*   **Code Scanning:** Integrate static application security testing (SAST) tools into the CI pipeline.
*   **Dependency Scanning:** Regularly scan for vulnerable dependencies.
