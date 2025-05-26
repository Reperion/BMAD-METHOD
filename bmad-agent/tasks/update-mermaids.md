# Update Mermaids Task

## Purpose

To systematically review project documentation and generate/update Mermaid diagrams in the `docs/mermaids/` folder, ensuring visual representations of the project's architecture, data flows, and processes are current and comprehensive.

## Inputs for this Task

- Access to all project documentation files, including but not limited to:
  - `docs/prd.md`
  - `docs/architecture.md`
  - `docs/ux-ui-spec.md`
  - `docs/api-backend-config.md`
  - `docs/tech-stack.md`
  - `docs/pm-assessment.md`
  - `docs/sm-assessment.md`
  - `docs/detailed-user-stories.md`
  - `docs/technical-spike-report.md`
  - `docs/technical-spike-report-ad-targeting.md`
  - `docs/devops-setup.md`
  - `docs/sprint-plan-1.md`
  - Any new story files in `docs/stories/`
- The `docs/mermaids/` directory for output.

## Task Execution Instructions

### 1. Initialize Mermaids Directory

- Ensure the `docs/mermaids/` directory exists. If not, create it.

### 2. Review Existing Diagrams

- List all `.md` files currently in `docs/mermaids/`.
- Note their content and the information they represent.

### 3. Identify Diagram Opportunities & Generate/Update

- Systematically review each relevant project documentation file.
- For each document, identify key concepts, flows, or structures that can be effectively visualized with Mermaid diagrams.
- Prioritize diagrams that represent high-level overviews or critical components.
- **Types of Diagrams to Consider:**
    *   **Flowcharts:** For processes, workflows (e.g., user onboarding, content upload flow, CI/CD pipeline).
    *   **Sequence Diagrams:** For interactions between components/services (e.g., authentication flow, notification delivery, ad targeting).
    *   **Class Diagrams:** For data models, object relationships (e.g., user, content, ad, geofence entities).
    *   **State Diagrams:** For lifecycle of entities (e.g., content moderation states).
    *   **Gantt Charts:** For project timelines (if applicable).
    *   **Mindmaps:** For brainstorming or hierarchical structures.
- **For each identified diagram:**
    1.  Extract the relevant information from the source document.
    2.  Generate the Mermaid syntax for the diagram.
    3.  Save the diagram to a new or existing file in `docs/mermaids/` with a descriptive name (e.g., `docs/mermaids/architecture-overview.md`, `docs/mermaids/content-upload-flow.md`).
    4.  Ensure the diagram is enclosed in a ````mermaid` block.
    5.  Add a brief description of the diagram's purpose and source.

### 4. Example Diagram Generation (Initial Set)

- **High-Level System Architecture (from `docs/architecture.md`):** Replicate or refine the existing system diagram.
- **Content Upload Flow (from `docs/prd.md`, `docs/architecture.md`):** Create a flowchart or sequence diagram.
- **User Authentication Flow (from `docs/detailed-user-stories.md`, `docs/architecture.md`):** Create a sequence diagram.
- **Ad Targeting Logic (from `docs/technical-spike-report-ad-targeting.md`):** Create a flowchart or sequence diagram.
- **CI/CD Pipeline (from `docs/devops-setup.md`):** Create a flowchart.

### 5. Final Review

- After generating/updating diagrams, perform a quick review to ensure:
    - All diagrams are syntactically correct.
    - Diagrams are clear and easy to understand.
    - Diagrams accurately reflect the source documentation.
    - The `docs/mermaids/` folder is well-organized.
