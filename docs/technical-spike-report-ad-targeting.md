# Technical Spike Report: Advanced Business Ad Targeting Logic

## 1. Introduction
This report outlines the findings and recommendations from a technical spike conducted to investigate the feasibility and optimal implementation strategies for advanced business ad targeting logic within the Location-Based Content Platform. The platform aims to facilitate location-based advertising tailored to consumer preferences and location.

## 2. Objectives of the Spike
*   Evaluate mechanisms for combining user preferences/interests with real-time location data for ad targeting.
*   Assess the role of existing technologies (Firestore, PostGIS, Algolia/Elasticsearch) in supporting complex targeting criteria.
*   Identify potential algorithms or data structures for efficient ad matching and delivery.
*   Determine if additional services or architectural patterns are required.

## 3. Findings

### 3.1. Combining User Preferences and Location
*   **User Preferences/Interests:** Stored in Firestore (`collections/users/{userId}`). These are static or semi-static attributes.
*   **Location Data:** Real-time user location is stored in PostGIS (for precise geofencing) and Firestore (for basic display).
*   **Challenge:** Efficiently querying and matching ads based on a combination of dynamic location (within a business's geofence) and static user preferences.

### 3.2. Role of Existing Technologies

*   **Firestore:** Suitable for storing user preferences and ad metadata. Can perform basic queries on these attributes.
*   **PostGIS:** Essential for precise geofence matching (e.g., `ST_Within` queries to identify users inside an ad's target area).
*   **Algolia/Elasticsearch:** Highly valuable for indexing and searching ad content, categories, and tags. Can also support filtering by user preferences if these are indexed alongside ad data.
    *   **Potential:** Could be used to pre-filter ads based on user preferences, then PostGIS could refine by location.

### 3.3. Ad Matching and Delivery Algorithms

*   **Basic Approach (MVP):**
    1.  Business defines ad with target geofence (stored in PostGIS) and optional preferences (stored in Firestore/Algolia).
    2.  When a user's location updates (triggering a Cloud Function via Pub/Sub), query PostGIS to find all active ads whose geofences the user is currently within.
    3.  For these ads, filter them further based on the user's preferences (from Firestore) and the ad's target preferences (from Firestore/Algolia).
    4.  Deliver relevant ads via FCM/Email/SMS.
*   **Advanced Considerations:**
    *   **Ad Ranking:** Implement algorithms (e.g., based on ad relevance, user engagement history, bid price for paid ads) to rank multiple matching ads.
    *   **Frequency Capping:** Prevent users from seeing the same ad too frequently. Requires tracking ad impressions per user.
    *   **A/B Testing:** Support for testing different ad creatives or targeting strategies.
    *   **Machine Learning:** For highly optimized targeting and personalization, ML models could predict user interest in specific ad types. This is clearly out of MVP scope.

### 3.4. Additional Services/Architectural Patterns

*   No new major services are strictly required for MVP, as the existing stack (Firestore, PostGIS, Cloud Functions, Pub/Sub, Algolia/Elasticsearch) can be leveraged.
*   **Pattern:** An "Ad Serving" Cloud Function (or set of functions) would be responsible for orchestrating the queries across PostGIS (location), Firestore (user/ad metadata), and potentially Algolia (ad content/preferences) to determine eligible ads.

## 4. Recommendations

1.  **Proceed with a phased implementation for ad targeting:**
    *   **Phase 1 (MVP):** Implement the basic ad matching logic as described above, leveraging PostGIS for geofence matching and Firestore for preference filtering.
    *   **Phase 2 (Post-MVP):** Explore advanced features like ad ranking, frequency capping, and more complex demographic targeting.
2.  **Leverage Algolia/Elasticsearch for Ad Indexing:** Sync ad data (including target preferences, categories, keywords) to Algolia/Elasticsearch to enable fast, flexible querying for ad discovery and initial filtering.
3.  **Dedicated Ad Serving Logic in Cloud Functions:** Create a modular set of Cloud Functions specifically for ad matching, filtering, and delivery, ensuring separation of concerns and scalability.
4.  **Data Model Refinement:** Ensure the data models for ads in Firestore clearly define target criteria (geofence ID, preference tags, etc.) to facilitate efficient querying.

## 5. Conclusion
Advanced business ad targeting logic is feasible within the current technology stack, primarily by orchestrating queries across Firestore, PostGIS, and Algolia/Elasticsearch via Cloud Functions. A phased approach is recommended, starting with basic location and preference matching for MVP, and expanding to more sophisticated algorithms post-MVP. This spike confirms technical readiness to proceed with detailed development of ad targeting features.
