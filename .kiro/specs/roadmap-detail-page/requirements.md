# Requirements Document

## Introduction

This document specifies the requirements for a full redesign of the `RoadmapDetailPage` component in the Designer's Room frontend. The page (`/roadmaps/ui-ux`) must be replaced with a rich, multi-section page that faithfully implements the Figma design (node 25:23, "Roadmap / UI-UX (full)"). All roadmap content is hardcoded as static data. The page shows all visual states (done, in-progress, locked, not-started) to demonstrate the complete design system.

---

## Glossary

- **RoadmapDetailPage**: The React page component rendered at `/roadmaps/:id`, which is the subject of this redesign.
- **Stage**: One of the six top-level learning phases of the UI/UX roadmap (e.g., "Foundations", "Visual Design").
- **Topic**: A single learning item inside a Stage, carrying a status, difficulty, and time estimate.
- **Checkpoint**: A hands-on assignment row inside a Stage that follows a group of Topics.
- **ProgressCard**: The floating card in the page header that displays the user's overall completion percentage and a CTA.
- **AccordionState**: The React state (`Set<number>`) tracking which Stage cards are currently expanded.
- **TopicStatus**: The completion state of a Topic — one of `'done'`, `'in-progress'`, `'not-started'`, `'locked'`.
- **Difficulty**: The difficulty tier of a Topic — one of `'beginner'`, `'intermediate'`, `'advanced'`.
- **StaticData**: The hardcoded `ROADMAP_DATA` constant that replaces API-fetched content.
- **DesignTokens**: The fixed colour and spacing values defined in the Figma design and used throughout this page (`#080808` background, `#ff6a00` orange, `#11100f` card surface, `#302923` border, etc.).

---

## Requirements

### Requirement 1: Static Data Layer

**User Story:** As a developer, I want all roadmap content served from a single hardcoded constant, so that the page renders instantly without network requests and all design states are demonstrable.

#### Acceptance Criteria

1. THE RoadmapDetailPage SHALL import and render from a single `ROADMAP_DATA` constant defined in a dedicated data file (`src/data/roadmapData.ts` or similar).
2. THE StaticData SHALL include exactly 6 stages, a total of 38 topics across all stages, and at least one Checkpoint per stage.
3. THE StaticData SHALL include topics in all four TopicStatus states (`done`, `in-progress`, `not-started`, `locked`) across the 6 stages.
4. THE StaticData SHALL include topics of all three Difficulty levels (`beginner`, `intermediate`, `advanced`).
5. WHEN the page is rendered, THE RoadmapDetailPage SHALL NOT make any network requests or use `useQuery` / `getRoadmap`.

---

### Requirement 2: Page Header Section

**User Story:** As a learner, I want to see a compelling hero header with the roadmap identity and my progress at a glance, so that I feel oriented and motivated to continue.

#### Acceptance Criteria

1. THE RoadmapDetailPage SHALL render a header section containing a left content block and a right ProgressCard.
2. THE header left block SHALL display a roadmap label "(Roadmap 01)", a large title ("UI/UX\nDesigner") in `#fff8ee` at 96px font size with letter-spacing of -2.88px, and a subtitle in `#b6ada4` at 18px.
3. THE header left block SHALL display exactly 4 meta pills with border `#302923`, text `#b6ada4`, rounded-full, and padding `px-14 py-7`.
4. THE ProgressCard SHALL be styled with `w-[400px]`, border `#302923`, background `#11100f`, rounded-24px, and `p-28` (padding 28px).
5. THE ProgressCard SHALL display a "YOUR PROGRESS" label in semibold 12px `#827a73` with letter-spacing 1.44px.
6. THE ProgressCard SHALL display the computed completion percentage as a 72px medium-weight number in `#fff8ee`.
7. THE ProgressCard SHALL display a "N of 38 topics" label adjacent to the percentage number.
8. THE ProgressCard SHALL display a horizontal progress bar with background `#1d1916`, orange fill `#ff6a00`, height 6px, and rounded corners.
9. THE ProgressCard SHALL display a "Continue: [topic title] →" CTA button with background `#ff6a00`, rounded-full, text `#080808` semibold.
10. THE ProgressCard SHALL display a "Progress saves when you're signed in" note in 12px muted text below the CTA.
11. THE header bottom row SHALL display discipline tabs; the active tab SHALL have background `#fff8ee` and text `#080808` semibold; inactive tabs SHALL have border `#302923` and text `#b6ada4`.

---

### Requirement 3: Progress Computation

**User Story:** As a learner, I want to see accurate progress numbers that reflect how many topics I have completed, so that I can track my learning progress.

#### Acceptance Criteria

1. THE RoadmapDetailPage SHALL compute `completedTopics` as the count of all Topics with `status === 'done'` across all 6 stages.
2. THE RoadmapDetailPage SHALL compute `totalTopics` as the total count of all Topics across all 6 stages.
3. WHEN `totalTopics` is greater than 0, THE ProgressCard SHALL display `Math.round((completedTopics / totalTopics) * 100)` as the percentage value.
4. IF no topic has `status === 'in-progress'`, THEN THE ProgressCard SHALL display a fallback label "Start where you left off" in place of the continue topic title.
5. THE RoadmapDetailPage SHALL derive progress entirely from StaticData at render time without storing it in component state.

---

### Requirement 4: Stages Accordion

**User Story:** As a learner, I want to expand and collapse individual stage cards to focus on the content I need, so that the long page is navigable.

#### Acceptance Criteria

1. THE RoadmapDetailPage SHALL manage accordion state as a `Set<number>` of stage IDs that are currently expanded, initialised with all 6 stage IDs (all open by default).
2. WHEN a user clicks the toggle (−/+) in a StageCard header, THE RoadmapDetailPage SHALL add the stage ID to the expanded set if it is absent, or remove it if it is present.
3. WHEN a user clicks the "Expand all" pill in ThePathTimeline header, THE RoadmapDetailPage SHALL set the expanded set to contain all 6 stage IDs.
4. WHEN a user clicks the "Collapse all" pill in ThePathTimeline header, THE RoadmapDetailPage SHALL set the expanded set to be empty.
5. WHILE a stage is in the expanded set, THE StageCard SHALL render all of its TopicRows and CheckpointRows below the stage header.
6. WHILE a stage is not in the expanded set, THE StageCard SHALL render only the stage header row and hide all TopicRows and CheckpointRows.

---

### Requirement 5: Topic Rows and Visual States

**User Story:** As a learner, I want each topic row to clearly show its status, difficulty, time, and what action I can take, so that I know exactly where I am in the roadmap.

#### Acceptance Criteria

1. WHEN a Topic has `status === 'done'`, THE TopicRow SHALL render a 26×26 circle with background `#ff6a00` and a white checkmark, and the topic title SHALL be rendered in `#827a73` (muted).
2. WHEN a Topic has `status === 'in-progress'`, THE TopicRow SHALL render a 26×26 circle with a `#302923` border and an orange dot inside, and the topic title SHALL be rendered in `#fff8ee` (bright).
3. WHEN a Topic has `status === 'not-started'`, THE TopicRow SHALL render a 26×26 circle with a `#302923` border and empty interior, and the title SHALL be rendered in `#fff8ee`.
4. WHEN a Topic has `status === 'locked'`, THE TopicRow SHALL render the check circle at reduced opacity, a "Needs: Stage XX" pill (border `#302923`, 12px, `#827a73`, rounded-full), and the title in `#827a73`.
5. THE TopicRow SHALL render a difficulty slot of fixed width 130px displaying one `●` dot for beginner, two `●●` for intermediate, or three `●●●` for advanced, followed by the capitalized difficulty label.
6. THE TopicRow SHALL render a time slot of fixed width 60px right-aligned displaying the topic's time estimate formatted as "[N] min".
7. WHEN a Topic has `status === 'done'`, THE TopicRow action slot SHALL display "Review" as plain text.
8. WHEN a Topic has `status === 'in-progress'` or `status === 'not-started'`, THE TopicRow action slot SHALL display a "Start →" pill with orange border and orange text.
9. WHEN a Topic has `status === 'locked'`, THE TopicRow action slot SHALL be empty.

---

### Requirement 6: Stage Card Structure

**User Story:** As a learner, I want each stage card to clearly show its identity, my progress within it, and its relationship to other stages, so that I can plan my learning path.

#### Acceptance Criteria

1. THE StageCard header row SHALL display the stage number label (e.g., "STAGE 01") in 14px semibold `#827a73` with letter-spacing 1.12px.
2. THE StageCard header row SHALL display the stage name in 30px medium `#fff8ee` with tracking -0.3px, the subtitle in 15px `#827a73`, and an inline "BY THE END" goal with orange label and `#b6ada4` description.
3. THE StageCard header row SHALL display a progress fraction (e.g., "3/6") and a small horizontal progress bar of width 96px and height 4px.
4. THE StageCard header row SHALL display a collapse/expand toggle button showing "−" when open and "+" when closed.
5. WHEN a Stage has a `prerequisiteStage`, THE StageCard SHALL display a "Needs: Stage 0N" pill (border `#302923`, `#827a73`, rounded-full).
6. WHEN a Stage has `status === 'done'`, THE StageCard SHALL display a "✓ Done" pill with background `#4a1b0c` and text `#ffd0a3`.
7. THE StageCard SHALL use background `#11100f`, border `#302923`, rounded-24px, and `overflow-hidden` to clip topic rows.

---

### Requirement 7: Checkpoint Rows

**User Story:** As a learner, I want checkpoint rows to stand out visually from regular topic rows, so that I know when I've reached a hands-on assignment milestone.

#### Acceptance Criteria

1. THE CheckpointRow SHALL be styled with background `rgba(74,27,12,0.35)`, a top border in `#302923`, and padding `px-32 py-24`.
2. THE CheckpointRow SHALL display a "CHECKPOINT" label in 11px semibold `#ff6a00` with letter-spacing 1.32px.
3. THE CheckpointRow SHALL display the checkpoint task description in 20px medium `#fff8ee`.
4. THE CheckpointRow SHALL display a time estimate in 14px `#b6ada4`.
5. WHEN a checkpoint has `status === 'done'`, THE CheckpointRow SHALL display a "✓ Done" pill with background `#4a1b0c` and text `#ffd0a3`.
6. WHEN a checkpoint has `status === 'pending'`, THE CheckpointRow SHALL display a "See brief →" pill with border `#302923` and text `#fff8ee`.

---

### Requirement 8: "Before You Start" Section

**User Story:** As a learner, I want a clear summary of who this roadmap is for, what I need to know first, and what I'll achieve, so that I can decide if this is the right path for me.

#### Acceptance Criteria

1. THE BeforeYouStartSection SHALL display a section label "(Before you start)" in 12px `#827a73`.
2. THE BeforeYouStartSection SHALL render exactly 3 equal-width cards in a horizontal row.
3. EACH BeforeYouStartCard SHALL use background `#11100f`, border `#302923`, rounded-20px, and padding 28px.
4. EACH BeforeYouStartCard SHALL display a colored heading in `#ff6a00`, 12px semibold with letter-spacing 1.44px (e.g., "WHO THIS IS FOR").
5. EACH BeforeYouStartCard SHALL display a title in `#fff8ee`, 22px medium.
6. EACH BeforeYouStartCard SHALL display a bulleted list where each bullet uses an orange `•` character and `#b6ada4` text at 15px.

---

### Requirement 9: "The Path" Timeline

**User Story:** As a learner, I want to see the full roadmap structure at a glance in a horizontal timeline, so that I understand the shape of the journey.

#### Acceptance Criteria

1. THE ThePathTimeline SHALL display a header row with the label "(The path)" and the pace text (e.g., "6 weeks at 30 minutes a day").
2. THE ThePathTimeline header SHALL include an "Expand all" pill and a "Collapse all" pill, each with border `#302923`, rounded-full, and padding `px-17 py-9`.
3. THE ThePathTimeline SHALL render exactly 6 timeline segments in a horizontal row.
4. EACH timeline segment SHALL display a colored top bar that is orange (`#ff6a00`) for `'done'` and `'in-progress'` stages and dim (`#302923`) for `'upcoming'` stages.
5. EACH timeline segment SHALL display the stage number, week range label (12px dim), stage name (19px medium `#fff8ee`), and topic count (16px `#b6ada4`).

---

### Requirement 10: Completion Card

**User Story:** As a learner who has reached the end of the roadmap, I want a motivating finish-line section with clear next steps, so that I know how to leverage what I've learned.

#### Acceptance Criteria

1. THE CompletionCard SHALL display a "(The finish line)" label in 12px `#827a73`.
2. THE CompletionCard SHALL display a large heading "Now go ship it." in `#fff8ee`.
3. THE CompletionCard SHALL display a subtitle describing next steps.
4. THE CompletionCard SHALL display a primary "Join the Weekly Challenge →" button with background `#ff6a00` and text `#080808`.
5. THE CompletionCard SHALL display a secondary "Share your progress" button with border `#302923`.
6. THE CompletionCard SHALL display a disabled "Challenge opens after beta" button in a dim, non-interactive style.

---

### Requirement 11: Layout and Design Tokens

**User Story:** As a user, I want the redesigned page to be visually consistent with the Figma design and the rest of the application, so that the experience feels cohesive and polished.

#### Acceptance Criteria

1. THE RoadmapDetailPage SHALL use `#080808` as the full-page background color.
2. ALL card surfaces SHALL use `#11100f` as background.
3. ALL borders SHALL use `#302923` unless a specific override is documented.
4. ALL primary accent elements SHALL use `#ff6a00` as the orange color.
5. THE page content SHALL be laid out with appropriate horizontal padding matching the rest of the application (`px-8 sm:px-12 md:px-16`).
6. THE RoadmapDetailPage SHALL NOT break the existing `AppLayout` (Navbar + Footer remain visible above and below the page content).
7. THE page SHALL be responsive; on viewports narrower than 768px, multi-column layouts (header left/right, 3-card row, 6-segment timeline) SHALL stack vertically.

---

### Requirement 12: Accessibility

**User Story:** As a user relying on assistive technologies, I want the page to be navigable by keyboard and screen reader, so that the content is accessible.

#### Acceptance Criteria

1. THE accordion toggle buttons in StageCard headers SHALL have descriptive `aria-label` attributes indicating the stage name and expanded/collapsed state.
2. THE progress bar in ProgressCard SHALL use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.
3. THE "Expand all" and "Collapse all" pills SHALL be `<button>` elements with accessible labels.
4. ALL interactive elements (buttons, pills, toggles) SHALL be keyboard-focusable and visually indicate focus using `focus-visible` styles consistent with the rest of the application.
5. THE check circle icons in TopicRows SHALL include `aria-label` text describing the topic status (e.g., "Completed", "In progress", "Not started", "Locked").
