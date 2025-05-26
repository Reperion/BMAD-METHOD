# Technology Stack Document: Location-Based Content Platform

## 1. Introduction
This document provides a comprehensive overview of the technology stack chosen for the Location-Based Content Platform. **The platform will be delivered primarily as a Progressive Web App (PWA)**. It serves as a central reference for developers, offering insights into each technology, best practices for this project, quick start guides, key configurations, and links to official documentation. The goal is to guide developers throughout the project, from local setup to deployment and maintenance.

## 2. Local Development Environment Setup

A consistent local development environment is crucial for team productivity.

### 2.1. Node.js
*   **Version:** Node.js 22.x (LTS recommended).
*   **Installation:** Use a version manager like `nvm` (Node Version Manager) to easily switch between Node.js versions.
    *   `nvm install 22`
    *   `nvm use 22`
    *   `nvm alias default 22` (to set as default)
*   **Verification:** `node -v` and `npm -v`

### 2.2. Firebase CLI
The Firebase Command Line Interface (CLI) is essential for developing, deploying, and managing Firebase projects.
*   **Installation:** `npm install -g firebase-tools`
*   **Login:** `firebase login` (Follow the prompts to authenticate with your Google account).
*   **Project Initialization:** Navigate to your project root and run `firebase init`. Select the Firebase features you'll be using (Functions, Firestore, Storage, Hosting, etc.). Link to your Firebase project.
*   **Emulators:** For local development and testing, Firebase provides a suite of emulators.
    *   `firebase emulators:start` (starts all configured emulators)
    *   `firebase emulators:start --only functions,firestore,storage` (starts specific emulators)
*   **Deployment:** `firebase deploy` (deploys all configured resources)
    *   `firebase deploy --only functions` (deploys only Cloud Functions)

### 2.3. IDE Extensions (Recommended for VS Code)
*   **ESLint:** For consistent code style and identifying issues.
*   **Prettier:** For automatic code formatting.
*   **React/React Native Snippets:** For faster development.
*   **Firebase Explorer:** To browse Firestore data, Cloud Storage, etc., directly from VS Code.
*   **ES7 React/Redux/GraphQL/React-Native snippets:** For common code structures.

## 3. Cloud Platform: Google Cloud Platform (GCP) / Firebase Studio

Firebase is Google's mobile and web application development platform, built on GCP.

### 3.1. Overview
Firebase provides a suite of services that cover most backend needs: Authentication, Realtime Database, Firestore, Cloud Storage, Cloud Functions, Hosting, and more. It's designed for rapid development and scales automatically.

### 3.2. Project Setup
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click "Add project" and follow the steps to create a new Firebase project.
3.  Link your Firebase project to an existing Google Cloud Project or create a new one.
4.  Enable necessary APIs in GCP Console (e.g., Cloud Functions API, Cloud SQL Admin API if using PostGIS).

### 3.3. Billing
*   Firebase offers a generous free Spark plan. For production applications, especially with Cloud Functions, Cloud SQL, or high usage of other services, upgrade to the Blaze plan (pay-as-you-go).
*   Monitor billing regularly in the GCP Console.

### 3.4. Key Configurations
*   **Project ID:** Unique identifier for your Firebase/GCP project.
*   **Service Accounts:** Manage access to GCP resources for Cloud Functions and other services.
*   **Firebase Project Settings:** Configure Android, iOS, and Web apps to get their respective configuration files/snippets.

## 4. Backend Logic: Cloud Functions for Firebase (Node.js 22)

Cloud Functions are serverless functions that execute in response to events triggered by Firebase features or HTTPS requests.

### 4.1. Overview
*   **Event-driven:** Functions can be triggered by Firestore writes, Auth events, Pub/Sub messages, HTTP requests, etc.
*   **Scalable:** Automatically scales based on demand.
*   **Node.js 22 Runtime:** Our preferred runtime environment.

### 4.2. Best Practices for This Project
*   **Modularity:** Organize functions into logical files/modules (e.g., `authFunctions.js`, `contentFunctions.js`, `geofenceFunctions.js`).
*   **Error Handling:** Implement robust error handling and logging (using Cloud Logging).
*   **Security:** Use Firebase Security Rules for Firestore/Storage access. Validate all incoming data.
*   **Environment Variables:** Use `functions.config()` for sensitive data or configuration that varies between environments (dev, staging, prod).
    *   `firebase functions:config:set mapbox.secret="YOUR_MAPBOX_SECRET_KEY"`
    *   Access in function: `functions.config().mapbox.secret`
*   **Cold Starts:** Be mindful of cold starts for HTTP-triggered functions. Optimize function code and dependencies.
*   **Idempotency:** Design functions to be idempotent, especially for background triggers, to handle retries gracefully.

### 4.3. Quick Start (Example HTTP Function)
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// To deploy: firebase deploy --only functions:helloWorld
// To test: Access the URL provided in the Firebase Console for this function.
```

### 4.4. Key Configurations
*   **Memory Allocation:** Configure memory for functions based on their needs (e.g., 256MB, 512MB).
*   **Timeout:** Set appropriate timeouts for functions.
*   **Region:** Deploy functions to a region close to your users and other Firebase/GCP services (e.g., `us-central1`, `europe-west1`).
*   **VPC Access:** If connecting to Cloud SQL, configure VPC Access for your functions.

## 5. Databases

### 5.1. Firestore (Primary Database)

### 5.1.1. Overview
Firestore is a flexible, scalable NoSQL document database for mobile, web, and server development. It offers real-time synchronization and offline support.

### 5.1.2. Data Modeling Best Practices for This Project
*   **Content:**
    *   `collections/content/{contentId}`: Stores content metadata (uploader, timestamp, location, categories, tags, media URL).
    *   `collections/content/{contentId}/ratings/{userId}`: Subcollection for individual user ratings.
    *   `collections/content/{contentId}/comments/{commentId}`: Subcollection for comments.
    *   `collections/content/{contentId}/likes/{userId}`: Subcollection for likes.
*   **Users:**
    *   `collections/users/{userId}`: Stores user profiles, interests, followed users.
*   **Geofences:**
    *   `collections/geofences/{geofenceId}`: Stores geofence definitions (coordinates, type, associated triggers).
*   **Denormalization:** For social features (like counts, comment counts, follower counts), use Cloud Functions to denormalize and update aggregate fields on the parent document to avoid expensive queries.
*   **Subcollections:** Use subcollections for data that grows with the parent document (e.g., comments, ratings).

### 5.1.3. Security Rules
*   Crucial for controlling access to your data directly from client-side.
*   Example (read/write content only if authenticated):
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /content/{contentId} {
          allow read: if request.auth != null;
          allow create: if request.auth != null;
          allow update, delete: if request.auth != null && request.auth.uid == resource.data.uploaderId;
        }
        // More rules for ratings, comments, users, etc.
      }
    }
    ```

### 5.1.4. Quick Start (Node.js)
```javascript
const admin = require('firebase-admin');
// admin.initializeApp(); // Already initialized in Cloud Functions

const db = admin.firestore();

// Add data
await db.collection('content').add({
  uploaderId: 'user123',
  location: new admin.firestore.GeoPoint(34.0522, -118.2437),
  text: 'Hello from LA!',
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});

// Get data with real-time listener
db.collection('content').where('location', '==', new admin.firestore.GeoPoint(34.0522, -118.2437))
  .onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  });
```

### 5.2. Cloud SQL (PostgreSQL with PostGIS)

### 5.2.1. Overview
Cloud SQL is a fully-managed relational database service. PostgreSQL with the PostGIS extension is ideal for advanced geospatial queries that might be too complex or inefficient for Firestore's native geo-queries (e.g., complex multipolygon intersections, advanced spatial analysis).

### 5.2.2. When to Use
*   For precise geofencing logic involving complex shapes (multipolygons).
*   When performing advanced spatial analysis or aggregations that are better suited for a relational model.
*   For storing large volumes of static geographic data (e.g., city boundaries, points of interest).

### 5.2.3. Setup
1.  Enable Cloud SQL Admin API in GCP Console.
2.  Create a new PostgreSQL instance in Cloud SQL.
3.  Enable the PostGIS extension on your database.
4.  Configure VPC Access for Cloud Functions to connect to Cloud SQL.

### 5.2.4. Connection (from Cloud Functions)
Use a database client library (e.g., `pg` for Node.js) and connect via a Unix socket or TCP.

### 5.3. Redis (for Caching)

### 5.3.1. Overview
Redis is an open-source, in-memory data structure store, used as a database, cache, and message broker. It's excellent for high-performance caching.

### 5.3.2. When to Use
*   Caching frequently accessed, but less frequently updated data (e.g., aggregated content statistics, user preferences).
*   Rate limiting API calls.
*   Session management (if not using Firebase Auth sessions).

### 5.3.3. Setup
*   Use Memorystore for Redis (GCP's fully managed Redis service).
*   Connect from Cloud Functions.

## 6. Object Storage: Cloud Storage for Firebase

### 6.1. Overview
Cloud Storage is a powerful, simple, and cost-effective object storage service. It's where user-uploaded media (images, videos) will be stored.

### 6.2. Best Practices
*   **Security Rules:** Use Firebase Storage Security Rules to control who can read/write files.
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /content_media/{userId}/{fileName} {
          allow read; // Anyone can read public content
          allow write: if request.auth != null && request.auth.uid == userId; // Only uploader can write
        }
      }
    }
    ```
*   **Resizing/Transcoding:** Use Cloud Functions triggered by new uploads to resize images or transcode videos into different formats/resolutions.
*   **Public vs. Private:** Decide if content should be publicly accessible or require authentication.

## 7. Messaging

### 7.1. Firebase Cloud Messaging (FCM)

### 7.1.1. Overview
FCM is a cross-platform messaging solution that lets you reliably send messages at no cost.

### 7.1.2. Setup (Web, Android, iOS)
*   **Web:** Requires a Firebase project, a web app registered, and a service worker to receive messages.
*   **Android/iOS:** Requires Firebase project, Android/iOS app registered, and FCM SDK integrated into the native app.
*   **Server-Side:** Send messages from Cloud Functions using the FCM Admin SDK.

### 7.1.3. Best Practices
*   **Topics:** Use topics for sending messages to groups of users (e.g., "new_content_in_area_X").
*   **Data Messages vs. Notification Messages:** Understand the difference and when to use each.
*   **Background Handling:** Implement logic for handling messages when the app is in the background or foreground.

### 7.2. Cloud Pub/Sub

### 7.2.1. Overview
Cloud Pub/Sub is an asynchronous messaging service that decouples senders and receivers.

### 7.2.2. Use Cases for This Project
*   **Event-driven Triggers:** Triggering background Cloud Functions after a new content upload, a geofence event, or a new social interaction.
*   **Decoupling:** Decoupling the main API flow from background processing tasks (e.g., image resizing, complex geofence checks, notification fan-out).

### 7.2.3. Setup
*   Create topics and subscriptions in GCP Console.
*   Publish messages from Cloud Functions.
*   Trigger Cloud Functions from Pub/Sub subscriptions.

### 7.3. Twilio (or similar for Email/SMS)

### 7.3.1. Overview
Twilio provides APIs for voice, SMS, and email. It's a robust platform for programmatic communication.

### 7.3.2. Setup
1.  Create a Twilio account.
2.  Obtain an Account SID and Auth Token.
3.  Purchase a Twilio phone number (for SMS) or set up an email sender (for email).

### 7.3.3. Integration with Cloud Functions
*   Use Twilio Node.js SDK in Cloud Functions.
*   Store Twilio credentials securely in Cloud Functions environment variables.
*   Example (sending SMS):
    ```javascript
    const functions = require('firebase-functions');
    const twilio = require('twilio');

    const accountSid = functions.config().twilio.sid;
    const authToken = functions.config().twilio.token;
    const client = new twilio(accountSid, authToken);

    exports.sendSmsNotification = functions.firestore.document('notifications/{notificationId}')
      .onCreate(async (snap, context) => {
        const notification = snap.data();
        if (notification.type === 'sms') {
          await client.messages.create({
            body: notification.message,
            to: notification.phoneNumber,
            from: functions.config().twilio.phone_number // Your Twilio phone number
          });
        }
        return null;
      });
    ```

## 8. Mapping: Mapbox

### 8.1. Overview
Mapbox provides a suite of tools for building custom maps.

### 8.2. API Keys
*   **Public Access Token:** Used in client-side code for map rendering and basic geocoding.
*   **Secret Access Token:** Used in Cloud Functions for any server-side Mapbox API calls (e.g., more complex geocoding, or future features requiring elevated permissions). Store securely in environment variables.

### 8.3. SDKs
*   **Mapbox GL JS:** For web applications.
*   **Mapbox Maps SDK for iOS/Android:** For native mobile applications.
*   **Mapbox GL Draw:** A library for drawing tools on Mapbox GL JS maps (for PC-based geofence drawing).

### 8.4. Best Practices
*   **Custom Styles:** Create a custom Mapbox style (dark theme with vibrant accents) in Mapbox Studio.
*   **Data Optimization:** Optimize geospatial data for efficient rendering on maps.
*   **Rate Limits:** Be aware of Mapbox API rate limits and implement caching where appropriate.

## 9. Search: Algolia or Elasticsearch

### 9.1. Overview
For highly performant and flexible search and filtering capabilities beyond what Firestore's native queries can efficiently provide.

### 9.2. Integration with Firestore
*   Use Cloud Functions to sync data from Firestore to Algolia/Elasticsearch whenever content is created, updated, or deleted.
*   Algolia provides a Firebase extension for easy integration. For Elasticsearch, a custom Cloud Function would be needed.

### 9.3. Setup
*   **Algolia:** Create an Algolia account, set up indices.
*   **Elasticsearch:** Deploy a managed Elasticsearch service (e.g., Elastic Cloud on GCP, or self-host on GCE/GKE).

## 10. Frontend

### 10.1. React/Next.js (Web - Primary PWA Client)

### 10.1.1. Overview
React is a JavaScript library for building user interfaces. Next.js is a React framework for production, offering server-side rendering (SSR), static site generation (SSG), and API routes. This will be the primary client for the PWA.

### 10.1.2. Best Practices
*   **PWA Best Practices:** Implement Service Workers for offline capabilities, push notifications, and "Add to Home Screen" functionality.
*   **SSR/SSG:** Use Next.js for performance and SEO benefits.
*   **Component-Based:** Build reusable UI components.
*   **State Management:** Use React Context API, Redux, or Zustand.
*   **Firebase SDKs:** Integrate Firebase Auth, Firestore, Storage, FCM SDKs.
*   **Mapbox GL JS:** Integrate for map display and geofence drawing.

### 10.2. React Native (Mobile - Future Consideration for Native App)

### 10.2.1. Overview
React Native allows building native mobile apps using JavaScript and React. While the initial focus is on the PWA, React Native is the proposed technology for future native mobile applications if required for deeper device integration or specific app store presence.

### 10.2.2. Best Practices
*   **Component-Based:** Build reusable UI components.
*   **State Management:** Use React Context API, Redux, or Zustand for state management.
*   **Performance:** Optimize rendering, use native modules for performance-critical tasks.
*   **Firebase SDKs:** Integrate Firebase Auth, Firestore, Storage, FCM SDKs.

## 11. Deployment Strategy

### 11.1. Serverless Deployment
*   Leverage Firebase Hosting for web clients and Cloud Functions for backend logic.
*   Mobile apps deployed to App Store/Google Play Store.

### 11.2. CI/CD Pipelines
*   Implement Continuous Integration/Continuous Deployment (CI/CD) pipelines for automated testing and deployment of Cloud Functions and client applications (e.g., using Cloud Build, GitHub Actions).

### 11.3. Monitoring and Logging
*   Utilize Firebase Crashlytics for crash reporting.
*   Use Google Cloud Logging for centralized logging from Cloud Functions and other GCP services.
*   Google Cloud Monitoring for performance metrics and alerts.

## 12. References & Further Reading

*   **Firebase Documentation:** [https://firebase.google.com/docs](https://firebase.google.com/docs)
*   **Google Cloud Documentation:** [https://cloud.google.com/docs](https://cloud.google.com/docs)
*   **Mapbox Documentation:** [https://docs.mapbox.com/](https://docs.mapbox.com/)
*   **Twilio Documentation:** [https://www.twilio.com/docs](https://www.twilio.com/docs)
*   **React Native Documentation:** [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
*   **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
*   **Algolia Documentation:** [https://www.algolia.com/doc/](https://www.algolia.com/doc/)
*   **Elasticsearch Documentation:** [https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
*   **PostGIS Documentation:** [https://postgis.net/documentation/](https://postgis.net/documentation/)
