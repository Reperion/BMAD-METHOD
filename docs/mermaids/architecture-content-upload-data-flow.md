# Architecture: Content Upload Data Flow Sequence Diagram

This sequence diagram details the data flow for content upload, voting, and social interactions within the Location-Based Content Platform, based on the architecture document.

```mermaid
sequenceDiagram
    participant User
    participant ClientApp
    participant CloudStorage
    participant Firestore
    participant CloudFunctions
    participant CloudPubSub
    participant GeospatialService
    participant FCM
    participant EmailSMSProvider

    User->>ClientApp: Captures content & location
    ClientApp->>CloudStorage: Uploads media
    ClientApp->>Firestore: Uploads metadata (including GPS)

    Firestore-->>CloudFunctions: Trigger (on new content metadata)
    CloudFunctions->>CloudFunctions: Processes content, validates
    CloudFunctions->>CloudPubSub: Publishes "new_content_uploaded" message

    CloudPubSub-->>CloudFunctions: Trigger (background function)
    CloudFunctions->>GeospatialService: Processes location data, checks geofence
    GeospatialService-->>CloudFunctions: Geofence trigger result

    alt Geofence Triggered
        CloudFunctions->>FCM: Sends push notification
        CloudFunctions->>EmailSMSProvider: Sends email/SMS
    end

    User->>ClientApp: Browses content
    ClientApp->>CloudFunctions: Requests content (filtered by location/prefs)
    CloudFunctions->>Firestore: Retrieves content
    Firestore-->>CloudFunctions: Content data
    CloudFunctions-->>ClientApp: Serves content

    User->>ClientApp: Submits 1-5 star rating
    ClientApp->>CloudFunctions: Calls API to submit rating
    CloudFunctions->>Firestore: Stores rating
    Firestore-->>CloudFunctions: Rating stored confirmation
    CloudFunctions-->>ClientApp: Serves next filtered content

    User->>ClientApp: Performs social action (like/comment)
    ClientApp->>CloudFunctions: Calls API for social action
    CloudFunctions->>Firestore: Updates social data
    Firestore-->>CloudFunctions: Update confirmation
    CloudFunctions-->>ClientApp: Real-time update (via Firestore/FCM)
