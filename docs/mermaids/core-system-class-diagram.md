# Core System Class Diagram

This class diagram describes the structure of key entities within the Location-Based Content Platform and their relationships.

```mermaid
classDiagram
    class User {
        +String userId
        +String email
        +String passwordHash
        +DateTime createdAt
        +DateTime lastLogin
        +List~Role~ roles
        +List~String~ interests
    }

    class Content {
        +String contentId
        +String userId
        +String type (text, image, video)
        +String mediaUrl (if image/video)
        +String textContent (if text)
        +Double latitude
        +Double longitude
        +String locationName
        +DateTime uploadedAt
        +List~String~ categories
        +List~String~ tags
        +Int averageRating
        +Int totalRatings
    }

    class Rating {
        +String ratingId
        +String userId
        +String contentId
        +Int stars (1-5)
        +DateTime ratedAt
    }

    class Geofence {
        +String geofenceId
        +String userId
        +String name
        +String type (circle, polygon)
        +Double centerLat (if circle)
        +Double centerLon (if circle)
        +Double radius (if circle)
        +List~Point~ polygonPoints (if polygon)
        +List~String~ interestedCategories
        +List~String~ interestedTags
        +Boolean notifyOnEntry
        +Boolean notifyOnExit
    }

    class Notification {
        +String notificationId
        +String userId
        +String type (push, email, sms)
        +String message
        +String relatedContentId
        +DateTime sentAt
        +Boolean isRead
    }

    User "1" -- "*" Content : uploads
    User "1" -- "*" Rating : gives
    User "1" -- "*" Geofence : defines
    User "1" -- "*" Notification : receives
    Content "1" -- "*" Rating : receives
    Geofence "1" -- "*" Notification : triggers
    Content "1" -- "1" Location : has
