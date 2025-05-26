# Technical Spike Report: Mapbox, Notifications, and Spatial Databases

## 1. Introduction
This report summarizes the findings from the technical spikes conducted to validate the feasibility and optimal implementation strategies for key technical areas of the Location-Based Content Platform, **which will be delivered primarily as a Progressive Web App (PWA)**: Mapbox API capabilities, notification mechanisms, and spatial database choices.

## 2. Mapbox API Capabilities Validation

### 2.1. Geofence Drawing (PC/Web)
*   **Feasibility:** **Highly Feasible.** Mapbox GL JS, combined with the `Mapbox GL Draw` library, fully supports the required PC/web-based geofence drawing functionalities.
    *   **Point-and-Click:** `Mapbox GL Draw` provides intuitive tools for drawing.
    *   **Shapes:** Supports drawing circles, rectangles, and complex multipolygons.
    *   **Undo Functionality:** Built-in undo/redo capabilities are available.
    *   **Precision:** Users can zoom in for precise shape creation.
*   **Recommendation:** Proceed with `Mapbox GL JS` and `Mapbox GL Draw` for the client-side geofence drawing interface.

### 2.2. Real-time Content Display
*   **Feasibility:** **Highly Feasible.** Mapbox GL JS is designed for high-performance map rendering and can efficiently display a large number of markers.
*   **Considerations:** Performance for displaying a very high volume of markers (e.g., tens of thousands concurrently) will depend on efficient data fetching from the backend and client-side optimization (e.g., clustering markers at lower zoom levels). Firestore's real-time capabilities will be crucial for pushing updates to clients.
*   **Recommendation:** Continue with Mapbox GL JS for content display, focusing on backend efficiency for data delivery and client-side rendering optimizations.

## 3. Notification Mechanisms Feasibility

### 3.1. Web Push Notifications
*   **Feasibility:** **Feasible.** Web Push Notifications are supported via Service Workers and Firebase Cloud Messaging (FCM).
*   **Considerations:** Requires explicit user permission. Implementation involves setting up a service worker to receive and display notifications even when the browser tab is closed.
*   **Recommendation:** Integrate Web Push Notifications using FCM for the web client.

### 3.2. FCM (Android/iOS Native App Push)
*   **Feasibility:** **Highly Feasible.** FCM is the standard and robust solution for delivering push notifications to Android and iOS native applications.
*   **Considerations:** Requires integration of the FCM SDK into the native mobile applications.
*   **Recommendation:** Utilize FCM for all native mobile push notifications.

### 3.3. Email/SMS Notifications (via Twilio/Alternatives)
*   **Feasibility:** **Highly Feasible.** Integration with third-party providers like Twilio via Cloud Functions is a standard pattern.
*   **Considerations:** Cost implications per message. Need to manage Twilio API keys securely.
*   **Recommendation:** Proceed with Twilio (or a suitable alternative) for email and SMS notifications, integrated via Cloud Functions.

### 3.4. Overall Notification Strategy
*   **Feasibility:** All proposed notification channels are technically feasible and can be integrated into a unified notification service managed by Cloud Functions.
*   **Challenge:** Managing user preferences for notification channels and frequency to avoid fatigue will be a key UX/UI and backend logic challenge.

## 4. Spatial Database Deep Dive

### 4.1. Firestore Geospatial Queries
*   **Capabilities:** Firestore supports basic geospatial queries (e.g., `where('location', '>=', geoPoint1).where('location', '<=', geoPoint2)` for bounding box queries, or using geohashes for proximity).
*   **Limitations:** Less efficient for complex spatial operations like polygon intersections (e.g., "is point X inside multipolygon Y?"), especially with frequently updating data or a large number of complex geofences. It's not optimized for advanced spatial indexing or complex joins.

### 4.2. PostGIS on Cloud SQL (PostgreSQL)
*   **Capabilities:** **Highly Capable and Recommended.** PostGIS is a powerful spatial extension for PostgreSQL, offering a comprehensive set of spatial functions and robust indexing (e.g., GiST, SP-GiST). It excels at:
    *   **Complex Geofencing:** Efficiently handling polygon intersections, `ST_Within`, `ST_Intersects` queries for complex shapes (multipolygons) and large numbers of geofences.
    *   **High-Frequency Location Updates:** Optimized for storing and querying constantly updating user locations for trigger matching.
    *   **Spatial Joins & Analysis:** Performing advanced spatial analysis.
*   **Considerations:** Adds a relational database to the NoSQL-centric Firebase stack, requiring careful data synchronization between Firestore and Cloud SQL for geospatial data. Requires VPC Access for Cloud Functions.
*   **Performance:** Offers superior performance for complex spatial queries compared to Firestore's native capabilities.

### 4.3. Recommendation for Spatial Data Management
*   **Hybrid Approach Recommended:**
    *   **Firestore:** Continue to use Firestore as the primary database for general content metadata, user profiles, and social interactions due to its real-time capabilities and ease of use. Store basic location data (GeoPoint) for simple display.
    *   **Cloud SQL with PostGIS:** **Adopt Cloud SQL with PostGIS as the dedicated geospatial database.** This will be used for:
        *   Storing precise geofence definitions (for both users and businesses).
        *   Storing high-frequency user location updates for efficient geofence trigger matching.
        *   Performing all complex spatial queries (e.g., "find all users within this business's geofence," "find all content within this user's custom geofence").
    *   **Synchronization:** Cloud Functions will be responsible for synchronizing relevant location data between Firestore and Cloud SQL (e.g., when a user's location updates in Firestore, trigger a Cloud Function to update PostGIS).

## 5. Refined Architectural Decisions

Based on these spikes, the architecture remains largely consistent but with a clearer definition for geospatial data handling:

*   **Geospatial Database:** Confirmed **Cloud SQL (PostgreSQL with PostGIS)** for advanced geofencing and high-frequency location updates. Firestore will handle basic location data.
*   **Notification Channels:** All proposed channels (Web Push, FCM for mobile, Email, SMS) are feasible and will be integrated.
*   **Mapbox:** Capabilities confirmed for all required map display and drawing functionalities.

## 6. Conclusion
The technical spikes confirm the feasibility of all core technical requirements. The hybrid approach for spatial data management (Firestore + PostGIS) provides the necessary power and flexibility for the platform's ambitious location-based features. We are technically ready to proceed with detailed development.
