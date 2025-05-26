# API & Backend Configuration: Mapbox Integration

## 1. Introduction
This document details the necessary Mapbox API integration and associated backend configurations for the Location-Based Content Platform. **The platform will be delivered primarily as a Progressive Web App (PWA)**, focusing on supporting map display, geocoding, and geofencing, with considerations for real-time location updates.

## 2. Mapbox API Services

Based on the requirements, the following Mapbox services will be utilized:

### 2.1. Mapbox GL JS / Mapbox Maps SDKs
*   **Purpose:** For rendering interactive maps on web and mobile clients. This includes displaying the base map, user's current location, and content markers.
*   **Client-Side Integration:** Integrated directly into the React/Next.js (web) and React Native (mobile) frontends.
*   **Features:** Supports custom styling (for dark theme), zooming, panning, and displaying various map layers.

### 2.2. Mapbox Geocoding API
*   **Purpose:** For converting human-readable addresses or place names into geographic coordinates (forward geocoding) and vice-versa (reverse geocoding). This will be used for search functionality and potentially for refining content location.
*   **Integration:** Primarily used client-side for user input, but can also be called from Cloud Functions for server-side processing if needed (e.g., validating addresses).

### 2.3. Mapbox GL Draw (for Geofence Drawing)
*   **Purpose:** While not a core Mapbox API service, Mapbox GL Draw is a library that integrates with Mapbox GL JS to provide tools for drawing and editing polygons, lines, and points on a map. This will be crucial for the PC-based geofence drawing interface.
*   **Client-Side Integration:** Integrated into the web client to allow users to draw circles, rectangles, and multipolygons.

## 3. Mapbox API Key Management

### 3.1. Key Generation
*   A public Mapbox Access Token will be generated from the Mapbox account.

### 3.2. Security & Management
*   **Client-Side:** The public Mapbox Access Token will be exposed in the client-side applications (web and mobile). Mapbox tokens are designed to be public, but their scope should be limited to necessary read-only operations (e.g., `styles:read`, `fonts:read`, `tilesets:read`, `geocoding:read`).
*   **Backend/Server-Side:** If any server-side Mapbox API calls are required (e.g., for more sensitive geocoding operations, or future features), a separate, more restricted private Mapbox Access Token should be used. This token **must be stored securely** in environment variables or a secret management service within the Google Cloud environment (e.g., Google Secret Manager) and accessed only by Cloud Functions.
*   **Environment Variables:** As specified, API keys will be managed via environment variables within the Cloud Functions deployment configuration.

## 4. Backend Configuration for Real-time Location & Geofencing

The requirement for user location updates every 10 seconds (for highest plan users) and matching these to triggers/content display necessitates a robust backend architecture.

### 4.1. Location Update Ingestion
*   **Mechanism:** Mobile/Web Clients will send location updates to a dedicated Cloud Function endpoint.
*   **Frequency:** Up to every 10 seconds for high-tier users.
*   **Data:** GPS coordinates, timestamp, user ID.

### 4.2. Geospatial Data Storage
*   **Primary:** Firestore will store user's last known location and content locations.
*   **Advanced Geofencing:** For complex geofencing (multipolygons, high volume checks) and precise spatial queries, a dedicated geospatial database like **PostGIS on Cloud SQL (PostgreSQL)** will be used. This allows for efficient `ST_Within`, `ST_Intersects` queries.

### 4.3. Geofencing Logic
*   **Triggering:** Cloud Functions will be triggered by location updates (via Pub/Sub or direct Firestore writes).
*   **Processing:**
    1.  When a user's location updates, a Cloud Function will query the Geospatial Database to identify any geofences the user has entered or exited.
    2.  It will also check for new content posted within geofenced areas the user is interested in (based on user profile interests).
    3.  For business-defined geofences (for ads/flash deals), the system will check if target users (based on preferences/location) are within the defined area.
*   **Notification Trigger:** If a geofence trigger condition is met, the Cloud Function will publish a message to Cloud Pub/Sub.

### 4.4. Content Display based on Location
*   **Filtering:** When a user browses the map, Cloud Functions will query Firestore (and potentially Algolia/Elasticsearch for advanced filtering) to retrieve content markers relevant to the user's current map view and applied filters (categories, tags, interests).
*   **Real-time Updates:** Firestore's real-time capabilities will be leveraged for near-instant updates of content markers on the map as new content is uploaded or locations change.

## 5. Integration with Notification Services

### 5.1. Push Notifications (FCM)
*   **Integration:** Cloud Functions will send messages to Firebase Cloud Messaging (FCM) for delivery to web (via service workers), Android, and iOS clients.
*   **Triggers:** Geofence entry/exit, new content in interested areas, social interactions (likes, comments, follows).

### 5.2. Email/SMS Notifications
*   **Provider:** Twilio is the preferred provider, but alternatives like SendGrid (for email) or other SMS gateways can be integrated.
*   **Integration:** Cloud Functions will make API calls to Twilio (or chosen provider) to send emails or SMS messages based on geofence triggers or other critical events.
*   **Templates:** Notification content will be managed via templates within Cloud Functions or the notification provider's service.

## 6. Data Flow (Mapbox & Location Focus)
1.  Client sends user location (every 10s for high-tier) to Cloud Function.
2.  Cloud Function updates user's location in Firestore and Geospatial Database.
3.  Geospatial Database triggers (or Cloud Function queries) for geofence intersections.
4.  If geofence triggered, Cloud Function publishes to Pub/Sub.
5.  Background Cloud Function (from Pub/Sub) sends notifications via FCM, Email/SMS Provider.
6.  Client requests map data from Mapbox API.
7.  Client requests content markers from Cloud Functions (filtered by map view, user preferences).
8.  Cloud Functions query Firestore/Algolia/Geospatial DB for relevant content.
9.  Content markers displayed on client's Mapbox map.
