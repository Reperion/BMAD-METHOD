# Project Schedule Gantt Chart

This Gantt chart provides a high-level overview of the project schedule, outlining key phases and their estimated durations.

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title Project Development Timeline

    section Project Initiation
    Project Charter & Scope     :a1, 2025-06-01, 7d
    Stakeholder Identification  :a2, after a1, 3d

    section Planning Phase
    Requirements Gathering      :b1, after a2, 10d
    System Design               :b2, after b1, 15d
    Resource Allocation         :b3, after b2, 5d

    section Execution Phase
    Backend Development         :c1, after b3, 30d
    Frontend Development        :c2, after b3, 25d
    Database Implementation     :c3, after b3, 20d
    Integration                 :c4, after c1, 10d

    section Monitoring & Control
    Testing & QA                :d1, after c4, 15d
    User Acceptance Testing (UAT):d2, after d1, 7d
    Bug Fixing                  :d3, after d2, 5d

    section Project Closure
    Deployment                  :e1, after d3, 3d
    Post-Mortem Analysis        :e2, after e1, 5d
    Documentation Handover      :e3, after e2, 3d
