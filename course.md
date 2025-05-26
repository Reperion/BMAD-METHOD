# Your Step-by-Step Guide to the BMAD-Method IDE Workflow

Welcome to this comprehensive course designed to guide you, a new user, through the exciting world of the BMAD-Method's AI-driven development workflow within your Integrated Development Environment (IDE). By the end of this course, you will have a clear understanding of how to set up, interact with, and leverage the powerful AI agents provided by the BMAD-Method to streamline your software development process.

This guide assumes you are using an IDE that supports custom AI agent configurations, such as Cursor, Windsurf, RooCode, or Cline. While specific steps for configuring custom modes might vary slightly between IDEs, the core concepts and interactions with the BMAD-Method agents remain consistent. We will provide generic instructions and point you to the relevant documentation for your specific IDE where necessary.

Let's get started!

## 1. Prerequisites: What You Need Before You Begin

Before diving into the BMAD-Method, please ensure you have the following:

*   **An IDE with Custom AI Agent Capabilities:** Make sure your IDE (e.g., Cursor, Windsurf, RooCode, Cline) has the functionality to create and configure custom AI agents or "custom modes." Refer to your IDE's documentation for how to enable and access this feature.
    *   For specific IDE setup instructions, you can refer to the `docs/ide-setup.md` file in the BMAD-Method repository.
*   **The BMAD-Method Repository Cloned:** You should have already cloned the entire BMAD-Method repository to your local machine. If you haven't, please do so now. This course assumes the repository is located at your project root.

## 2. Step 1: Setting Up Your Project Environment

The first crucial step is to integrate the BMAD-Method's assets into your project.

### 2.1. Copying the `bmad-agent` Folder

The `bmad-agent` folder contains all the necessary components for the BMAD-Method agents to function: personas, tasks, checklists, templates, and data.

**Action:**
1.  Navigate to the root directory of your cloned BMAD-Method repository.
2.  Locate the `bmad-agent` folder.
3.  **Copy** this entire `bmad-agent` folder.
4.  **Paste** the `bmad-agent` folder into the root directory of *your specific development project*.
    *   **Example:** If your project is named `my-awesome-app`, ensure the `bmad-agent` folder is directly inside `my-awesome-app/`.
    *   **Why?** This makes all the agent's resources locally accessible and ensures they can find the files they need to operate.

### 2.2. Understanding the `bmad-agent` Directory Structure

Take a moment to familiarize yourself with the contents of the `bmad-agent` folder. This will help you understand where different types of agent assets are stored.

*   `bmad-agent/personas/`: Contains the definitions for various AI agent roles (e.g., `dev.ide.md`, `sm.ide.md`, `architect.md`). These are the "brains" of your agents.
*   `bmad-agent/tasks/`: Holds specific, reusable instruction sets that agents can perform on demand (e.g., `checklist-run-task.md`, `create-prd.md`).
*   `bmad-agent/checklists/`: Stores markdown files with structured guidance for agents to follow (e.g., `architect-checklist.md`, `story-dod-checklist.md`).
*   `bmad-agent/templates/`: Contains pre-defined markdown structures for generating consistent project artifacts (e.g., `architecture-tmpl.md`, `prd-tmpl.md`, `story-tmpl.md`).
*   `bmad-agent/data/`: Includes supporting information like a knowledge base (`bmad-kb.md`) and technical preferences (`technical-preferences.txt`).

## 3. Step 2: Configuring Your First Standalone IDE Agent

Let's set up a basic, single-purpose agent to understand the fundamental configuration process. We'll use the `dev.ide.md` (Developer Agent) as an example.

### 3.1. Choosing a Persona: The Developer Agent (`dev.ide.md`)

The Developer Agent is designed to assist with coding tasks, architectural decisions, and generating development-related artifacts.

**Action:**
1.  Open the file `bmad-agent/personas/dev.ide.md` in your IDE.
2.  **Copy the entire content** of this file to your clipboard. This content is the "prompt" or "instructions" for your custom agent.

### 3.2. Creating a Custom Agent Mode in Your IDE

Now, you'll paste the copied content into your IDE's custom agent configuration. The exact steps vary by IDE, but the general process is as follows:

**Generic Steps (Consult your IDE's documentation for specifics):**
1.  **Access Custom Agent Settings:** Look for a "Custom Modes," "Custom Agents," or "Agent Configuration" section in your IDE's settings or preferences. This might be under "AI," "Chat," or "Features."
    *   **Example (Cursor):** Settings → Features → Chat → Custom modes.
    *   **Example (Windsurf):** "Windsurf - Settings" button (bottom right) → Advanced Settings.
    *   **Example (Cline):** Cline → Settings → Custom Instructions.
2.  **Create a New Custom Mode:** Find an option to "Create New Custom Mode" or "Add New Agent."
3.  **Name Your Agent:** Give your new agent a descriptive name, such as "BMAD Dev Agent."
4.  **Paste the Instructions:** In the designated prompt or instruction field, **paste the entire content** you copied from `bmad-agent/personas/dev.ide.md`.
5.  **Configure Other Settings (Optional but Recommended):**
    *   **Model:** Choose a suitable AI model (e.g., a capable large language model like GPT-4, Gemini, Claude).
    *   **Tools/Capabilities:** Ensure the agent has access to necessary tools (e.g., file reading/writing, code execution, if your IDE allows).
    *   **File Restrictions/Permissions:** Some IDEs allow you to define which file types or directories the agent can interact with. For a Dev Agent, it should typically have broad access to code files.
6.  **Save/Enable Your Custom Mode:** Save your new custom agent configuration. It should now be available for use in your IDE's AI chat interface.

### 3.3. Your First Interaction with the Standalone Agent

Now that your "BMAD Dev Agent" is configured, let's try interacting with it.

**Action:**
1.  Open your IDE's AI chat window or panel.
2.  **Select your newly created "BMAD Dev Agent"** as the active agent or mode.
3.  **Send a simple prompt:** Type something like:
    `"As a Dev Agent, explain the purpose of the 'bmad-agent/templates/' folder."`
4.  **Observe the Response:** The agent should respond in character, explaining that the folder contains pre-defined markdown structures for generating consistent project artifacts like architecture designs, PRDs, and user stories.

### 3.4. Understanding Artifact Generation Paths

The `dev.ide.md` and `sm.ide.md` agents are pre-configured to generate specific artifacts in certain locations within your project.

*   **Architecture and PRD Artifacts:** These will be generated and saved into your project's `(project-root)/docs/` directory.
*   **Stories:** User stories will be generated and saved into your project's `(project-root)/docs/stories/` directory.

**Action:**
1.  Create these directories if they don't already exist in your project root:
    *   `mkdir -p docs`
    *   `mkdir -p docs/stories`
2.  **Test Artifact Generation:**
    *   With your "BMAD Dev Agent" selected, send a prompt like:
        `"As a Dev Agent, draft a simple architecture overview for a 'Task Management App' using the provided template. Save it to the 'docs/' folder."`
    *   After the agent responds, check your `docs/` folder. You should find a new markdown file (e.g., `task-management-app-architecture.md`) containing the drafted architecture.

## 4. Step 3: Introducing the BMAD Orchestrator Agent

While standalone agents are useful, the Orchestrator Agent is the true power-house of the BMAD-Method, allowing you to switch between personas seamlessly without reconfiguring your IDE.

### 4.1. Why Use the Orchestrator?

The Orchestrator BMad Agent (`ide-bmad-orchestrator.md`) acts as a central hub. Instead of creating a separate custom mode for every single persona (Architect, PM, PO, etc.), you configure *one* Orchestrator agent. You then tell the Orchestrator which persona to "become," and it adopts that persona's instructions. This is incredibly efficient for managing many different AI roles.

### 4.2. Configuring the Orchestrator Agent

The process is very similar to configuring a standalone agent.

**Action:**
1.  Open the file `bmad-agent/ide-bmad-orchestrator.md` in your IDE.
2.  **Copy the entire content** of this file to your clipboard.
3.  **Create a new custom agent mode** in your IDE's settings.
4.  **Name this agent:** "BMAD Orchestrator."
5.  **Paste the instructions:** Paste the copied content into the prompt/instruction field.
6.  **Save/Enable** your "BMAD Orchestrator" custom mode.

### 4.3. Interacting with the Orchestrator: How to Make it "Become" Another Agent

This is where the magic happens. You'll instruct the Orchestrator to adopt a different persona.

**Action:**
1.  Open your IDE's AI chat window.
2.  **Select your "BMAD Orchestrator"** as the active agent.
3.  **Instruct the Orchestrator to "become" a persona.** For example, to switch to the Architect persona:
    `"Become the Architect Agent."`
    *   The Orchestrator should acknowledge this and confirm it has adopted the Architect persona.
4.  **Test the new persona:** Now, send a prompt that is specific to the Architect role:
    `"As the Architect Agent, what are the key considerations for designing a scalable microservices architecture?"`
    *   The agent should respond with insights relevant to an Architect.
5.  **Switch to another persona:** Try switching to the Product Owner (PO) persona:
    `"Become the Product Owner Agent."`
    *   Then, test it: `"As the Product Owner Agent, what is the primary goal of a Product Requirements Document (PRD)?"`
    *   The agent should respond from the PO's perspective.

## 5. Step 4: Working with Tasks

Tasks are specialized instruction sets that agents can execute. They are perfect for one-off actions or complex operations that don't need to be part of an agent's core persona definition.

### 5.1. What are Tasks and Why are They Useful?

*   **Definition:** Tasks are markdown files in `bmad-agent/tasks/` that contain detailed instructions for a specific job.
*   **Usefulness:**
    *   **Reduces Agent Bloat:** Keeps agent persona definitions concise.
    *   **On-Demand Functionality:** Any capable agent can perform a task by being given its content.
    *   **Versatility:** Used for things like running checklists, creating specific documents, or performing research.

### 5.2. How to Use a Task: Example Walkthrough

Let's use the `create-prd.md` task as an example. This task guides an agent through the process of creating a Product Requirements Document.

**Action:**
1.  Open the file `bmad-agent/tasks/create-prd.md` in your IDE.
2.  **Copy the entire content** of this file to your clipboard.
3.  **Open your IDE's AI chat window** and ensure your "BMAD Orchestrator" (or any other capable agent) is selected.
4.  **Send a prompt to execute the task.** You will typically preface the task content with an instruction. For example:
    `"Please execute the following task to create a PRD for a new 'Online Bookstore' application. Here is the task content:`
    `[PASTE THE ENTIRE CONTENT OF create-prd.md HERE]`
    `"`
    *   **Important:** Make sure to paste the *entire* content of the task file after your instruction.
5.  **Follow Agent Prompts:** The agent will likely ask you clarifying questions or guide you through the PRD creation process, referencing the steps outlined in the `create-prd.md` task. Provide the requested information.
6.  **Observe Artifact Generation:** As part of the `create-prd.md` task, the agent will likely generate a PRD document. Remember, PRDs are saved to your `(project-root)/docs/` directory. Check this folder after the task is complete.

## 6. Step 5: Leveraging Checklists and Templates

Agents in the BMAD-Method are designed to utilize the checklists and templates provided in the `bmad-agent` folder to ensure consistency and quality in their output.

### 6.1. How Agents Use These Assets

*   **Checklists:** When an agent is performing a task (e.g., creating a story, designing architecture), it can be instructed or inherently programmed to consult a relevant checklist (e.g., `story-dod-checklist.md`, `architect-checklist.md`). This ensures all necessary criteria are met and the output is comprehensive.
*   **Templates:** When generating documents, agents will use the appropriate template (e.g., `prd-tmpl.md`, `architecture-tmpl.md`). This ensures the document has a consistent structure, headings, and sections, making it easier to read and manage.

### 6.2. Where to Find Them

*   **Checklists:** `bmad-agent/checklists/`
*   **Templates:** `bmad-agent/templates/`

You don't typically need to copy/paste these files directly into the chat. The agents are designed to know where to find and use them, especially when executing tasks or generating artifacts. Your role is to ensure the `bmad-agent` folder is correctly placed in your project root.

## Conclusion: You're Ready to Build with AI!

Congratulations! You've completed this introductory course to the BMAD-Method IDE workflow. You now understand:

*   How to set up your project environment by copying the `bmad-agent` folder.
*   How to configure standalone AI agents in your IDE.
*   The power and efficiency of the BMAD Orchestrator Agent for persona switching.
*   How to utilize tasks for specific, on-demand operations.
*   The role of checklists and templates in guiding agent behavior and ensuring consistent output.

You are now equipped to start experimenting with the BMAD-Method in your own development projects. Remember to explore the different personas and tasks available in the `bmad-agent` folder to discover the full range of capabilities.

Happy AI-driven development!
