# UX/UI Specification: Location-Based Content Platform

## 1. Introduction
This document details the User Experience (UX) and User Interface (UI) specifications for the Location-Based Content Platform. **The platform will be delivered primarily as a Progressive Web App (PWA)**, emphasizing a dark theme with vibrant accents, intuitive navigation, and seamless integration with Mapbox for location-based interactions. It incorporates a mandatory content rating system and robust social interaction features.

## 2. Design Principles
*   **Dark & Vibrant:** Primary aesthetic will be a dark theme, utilizing deep grays and blacks, contrasted with vibrant, high-contrast accent colors (e.g., electric blue, neon green, bright magenta) for interactive elements, highlights, and calls to action.
*   **Intuitive & Minimal:** Clean interface, easy-to-understand icons, and clear typography to minimize cognitive load.
*   **Location-Centric:** Map will be a primary visual element, with content seamlessly integrated and discoverable.
*   **Responsive:** Design will adapt gracefully across various screen sizes (mobile-first approach).
*   **Accessible:** Adherence to accessibility guidelines (WCAG 2.1 AA) for color contrast, font sizes, and navigation.
*   **Feedback-Driven:** The mandatory rating system is central to content flow and quality.

## 3. Key Screens/Views

### 3.1. Splash/Onboarding Screen
*   **Visuals:** Dark background, prominent logo, vibrant loading indicator.
*   **Flow:** Brief, engaging introduction to the app's core value proposition. Permissions requests (location, notifications).

### 3.2. Map View (Home Screen)
*   **Layout:** Full-screen Mapbox map as the central element.
    *   **Content Markers:** Content conforming to user filters/preferences will be displayed as distinct markers on the map. Markers will visually indicate content type (e.g., video icon for video content, image icon for photos).
    *   **User Location:** Clearly marked current user location.
*   **UI Elements:**
    *   **Search Bar:** Prominent, dark-themed search bar at the top for locations, content, tags, or usernames.
    *   **Filter/Sort Options:** Subtle, vibrant icons for filtering content (e.g., by type, time, distance, categories, tags).
    *   **Upload Button:** Floating Action Button (FAB) at the bottom-right, vibrant accent color, for quick content upload.
    *   **Navigation Bar (Bottom):** Icons for Home (Map), Profile, Notifications, Settings. Vibrant active state.
*   **Interaction:**
    *   Tapping on a content marker reveals a **popup preview** that can pre-play video content or show a thumbnail for images/text.
    *   The popup will include options for **saving as favorite** and **sharing**.
    *   Tapping the popup or a dedicated button within it navigates to the full **Content Detail Screen**.
    *   Pinch-to-zoom, drag-to-pan map for browsing.

### 3.3. Content Upload Screen
*   **Layout:** Clean, multi-step form.
*   **Elements:**
    *   **Media Input:** Camera icon for photo/video, text input for caption.
    *   **Location Display:** Read-only display of current detected location. Option to manually adjust location on a mini-map.
    *   **Privacy Settings:** Toggle switches for public/private/friends.
    *   **Tags/Categories:** Input field for relevant tags and selection of predefined categories.
    *   **Post Button:** Vibrant, full-width button.

### 3.4. Content Detail Screen (with Mandatory Voting)
*   **Layout:** Full-screen view of selected content.
*   **Elements:**
    *   **Media Display:** Large image/video viewer with full-screen playback capability.
    *   **Caption/Description:** Clear, readable text.
    *   **Location Info:** Map snippet showing content location, distance from user.
    *   **User Info:** Uploader's profile picture and name.
    *   **Interaction & Navigation (Mandatory Voting):**
        *   **Prominent 1-5 Star Rating:** A clear, visually appealing 1-5 star rating component will be displayed.
        *   **Action:** Users *must* select a star rating.
        *   **Navigation:** Selecting a star rating will either automatically transition to the next piece of filtered content or close the current content view, ensuring feedback is always captured.
    *   **Social Reactions:**
        *   **Likes/Reactions:** Small, known icons (e.g., heart, thumbs-up) for likes/reactions, integrated subtly into the content display (e.g., on map popups, content detail screen).
        *   **Comments:** Small, known icon for comments, leading to a dedicated comment section.
        *   **Basic Following/Follower:** Small, known icon for following/follower functionality, integrated into user profiles or content display.
        *   **Share Button:** For sharing content externally.
        *   **Favorite Button:** To save content to user's favorites.

### 3.5. Profile Screen
*   **Layout:** User's uploaded content displayed in a grid or list.
*   **Elements:** Profile picture, username, basic stats (e.g., number of uploads, average rating of their content).

### 3.6. Notifications Screen
*   **Layout:** List of push notifications.
*   **Elements:** Notification title, brief message, timestamp. Vibrant unread indicator.

### 3.7. Geofence Drawing Interface (PC/Web)
*   **Layout:** Integrated into the main web client's map view.
*   **Interaction:**
    *   **Point and Click Drawing:** Users can draw geofences directly on the map using a point-and-click interface.
    *   **Shape Support:** Tools for drawing rectangles, circles, and multipolygons.
    *   **Undo Function:** Easy-to-use undo function for correcting mistakes during drawing.
    *   **Zoom:** Support for zooming in for precise shape creation.
*   **Output:** Once drawn, the geofence can be saved and associated with notification preferences (push, email, SMS).

### 3.8. Optional Content Feed (for Paying Users)
*   **Layout:** A separate display view without the map, providing a scrollable feed of content.
*   **Purpose:** Offers an alternative content consumption experience for users who prefer a traditional feed format.

## 4. Theming & Visual Design

### 4.1. Color Palette
*   **Primary Backgrounds:** `#121212` (Deep Black), `#1E1E1E` (Dark Gray)
*   **Secondary Backgrounds/Cards:** `#2C2C2C` (Medium Dark Gray)
*   **Text:** `#E0E0E0` (Light Gray for primary text), `#A0A0A0` (Medium Gray for secondary text)
*   **Accent Colors (Vibrant):**
    *   `#00FFFF` (Cyan/Aqua) - for primary interactive elements, highlights, active states
    *   `#FF00FF` (Magenta) - for secondary interactive elements, warnings, selected states
    *   `#00FF00` (Lime Green) - for success states, positive indicators
*   **Error/Warning:** `#FF4500` (OrangeRed)

### 4.2. Typography
*   **Font Family:** Clean, modern sans-serif (e.g., Roboto, Inter, Montserrat).
*   **Headings:** Bold, slightly larger, vibrant accent color for key titles.
*   **Body Text:** Readable size, good line height.

### 4.3. Iconography
*   **Style:** Outline or filled, consistent stroke weight.
*   **Color:** Primarily light gray, with vibrant accents for active states or critical actions. Small, known icons for social interactions.

## 5. Geofencing UX
*   **Triggered Content:** When a user enters a geofenced area where content has been posted, a prominent notification (push and/or in-app banner) will alert them. Tapping this notification will take them directly to the relevant content on the map or a curated list.
*   **Map Browsing:** Users can actively browse the map to discover content within any area, regardless of geofence triggers.
*   **Setup:** For businesses or advanced users defining geofences (e.g., for ad targeting or specific content zones), provide an intuitive map-based interface to draw polygons or circles.
*   **Visual Feedback:** Clearly highlight active geofenced areas on the map for users who have opted into such displays.

## 6. Push Notification UX
*   **Opt-in:** Clear opt-in process during onboarding or in settings.
*   **Categorization:** Allow users to customize notification types (e.g., new content in area, comments on my content, geofence entry/exit).
*   **In-App Display:** Notifications also accessible within a dedicated in-app screen.

## 7. Accessibility Considerations
*   Ensure sufficient color contrast ratios (minimum 4.5:1 for text).
*   Provide clear focus indicators for keyboard navigation.
*   Implement proper semantic HTML/component structure.
*   Support dynamic type sizing.
*   Provide alternative text for images and media.

## 8. Future UX/UI Considerations
*   Augmented Reality (AR) view for content overlay.
*   Gamification elements (badges, leaderboards for content creation/rating).
*   Enhanced business dashboards for ad campaign and content performance management.
*   Live streaming capabilities with location tagging.
