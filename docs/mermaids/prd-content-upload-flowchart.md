# PRD: Content Upload User Journey Flowchart

This flowchart illustrates the user journey for uploading content to the Location-Based Content Platform.

```mermaid
graph TD
    A[User Opens App] --> B{Location Services Enabled?};
    B -- No --> C[Prompt to Enable Location];
    C --> A;
    B -- Yes --> D[App Detects Current Location];
    D --> E[User Selects Upload Content];
    E --> F[User Chooses Content Type (Text, Image, Video)];
    F --> G[User Captures/Selects Content];
    G --> H[User Adds Caption/Description];
    H --> I[User Adds Categories/Tags (Optional)];
    I --> J[Content Automatically Tagged with Location];
    J --> K[User Previews Content];
    K --> L{Ready to Post?};
    L -- Yes --> M[User Submits Content];
    M --> N[Content Uploaded to Server];
    N --> O[Confirmation Message Displayed];
    L -- No --> P[User Edits Content];
    P --> F;
