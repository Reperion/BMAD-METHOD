# High-Level Project Workflow Flowchart

This flowchart illustrates the main stages of the software development lifecycle for this project.

```mermaid
graph TD
    A[Project Idea] --> B{Feasibility Study?};
    B -- Yes --> C[Requirements Analysis];
    B -- No --> F[Project Rejected];
    C --> D[Design];
    D --> E[Development];
    E --> G[Testing];
    G --> H[Deployment];
    H --> I[Maintenance & Support];
    I --> J[End of Life / New Version];
