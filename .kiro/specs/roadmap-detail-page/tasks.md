# Implementation Plan: Roadmap Detail Page

## Overview

Implement the complete redesign of `RoadmapDetailPage` to match the Figma design (node 25:23). The work proceeds in layers: first the data model and utility functions (testable immediately), then section components bottom-up, then the assembled page, and finally wiring everything together with the accordion state.

## Tasks

- [ ] 1. Create static data file and TypeScript types
  - Create `src/data/roadmapData.ts` with the full TypeScript type definitions: `RoadmapData`, `StageData`, `TopicData`, `CheckpointData`, `ProgressState`, `DisciplineTab`, `BeforeYouStartCard`, `TimelineSegmentData`, `TopicStatus`, `Difficulty`
  - Populate the `ROADMAP_DATA` constant with all 6 stages, 38 topics, checkpoints, and "Before you start" cards
  - Include topics in all four statuses (`done`, `in-progress`, `not-started`, `locked`) and all three difficulty levels
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Implement utility functions
  - [ ] 2.1 Implement `computeProgress(stages: StageData[]): ProgressState` in `src/data/roadmapUtils.ts`
    - Count topics with `status === 'done'` for `completedTopics`
    - Count all topics for `totalTopics`
    - Find first `'in-progress'` topic title for `continueTopicTitle`; return `""` if none
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ]* 2.2 Write property test for `computeProgress`
    - Install `fast-check` as a dev dependency
    - Create `src/data/roadmapUtils.test.ts`
    - **Property 1: Progress computation accuracy** — generate random stage arrays with random topic statuses; assert `completedTopics` equals count of `'done'` topics and `totalTopics` equals total topic count
    - **Property 2: Progress fraction invariant** — assert `completedTopics ≤ totalTopics` always holds
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 2.3 Implement `getDifficultyLabel(difficulty: Difficulty): string` in `src/data/roadmapUtils.ts`
    - Return `"● Beginner"`, `"●● Intermediate"`, or `"●●● Advanced"`
    - _Requirements: 5.5_

  - [ ] 2.4 Implement `getTopicActionLabel(topic: TopicData): 'review' | 'start' | null` in `src/data/roadmapUtils.ts`
    - Return `'review'` for `done`, `'start'` for `not-started`/`in-progress`, `null` for `locked`
    - _Requirements: 5.7, 5.8, 5.9_

  - [ ] 2.5 Implement `formatTime(minutes: number): string` in `src/data/roadmapUtils.ts`
    - Return `"${minutes} min"`
    - _Requirements: 5.6_

  - [ ]* 2.6 Write property tests for remaining utilities
    - **Property 3: Difficulty label determinism** — for each of the three `Difficulty` values, assert dot count and label text
    - **Property 4: Action label derivation** — for each of the four `TopicStatus` values, assert the correct return value
    - **Property 5: Time format determinism** — generate random positive integers, assert output contains the number and "min"
    - _Requirements: 5.5, 5.6, 5.7, 5.8, 5.9_

- [ ] 3. Checkpoint — utilities complete
  - Ensure all utility tests pass. Run `npm run test:run` and confirm no failures before proceeding.

- [ ] 4. Implement `ProgressCard` component
  - Create `src/components/roadmap/ProgressCard.tsx`
  - Props: `completedTopics`, `totalTopics`, `continueTopicTitle`
  - Render "YOUR PROGRESS" label, percentage number (72px), "N of 38 topics" text, progress bar with `role="progressbar"` and aria attributes, "Continue: [title] →" CTA button, fallback label when `continueTopicTitle` is empty
  - Apply design tokens: card bg `#11100f`, border `#302923`, rounded-24px; bar fill `#ff6a00`, track `#1d1916`; CTA bg `#ff6a00` text `#080808`
  - _Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 3.3, 3.4, 12.2_

- [ ] 5. Implement `PageHeader` component
  - Create `src/components/roadmap/PageHeader.tsx`
  - Props: `roadmap: RoadmapData`, `progress: ProgressState`
  - Render left block: label, 96px title (`#fff8ee`, tracking -2.88px), 18px subtitle (`#b6ada4`), 4 meta pills
  - Render right block: `<ProgressCard />` with `w-[400px]`
  - Render bottom: discipline tabs row with active/inactive pill styles
  - _Requirements: 2.1, 2.2, 2.3, 2.11_

- [ ] 6. Implement `BeforeYouStartSection` component
  - Create `src/components/roadmap/BeforeYouStartSection.tsx`
  - Props: `cards: BeforeYouStartCard[]`
  - Render "(Before you start)" section label (12px `#827a73`)
  - Render 3 cards in a `flex` row; each card: bg `#11100f`, border `#302923`, rounded-20px, p-28
  - Card contents: orange heading (12px semibold, tracking 1.44px), title (22px medium `#fff8ee`), bullet list (orange `•`, text `#b6ada4`, 15px)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 7. Implement `ThePathTimeline` component
  - Create `src/components/roadmap/ThePathTimeline.tsx`
  - Props: `segments: TimelineSegmentData[]`, `onExpandAll: () => void`, `onCollapseAll: () => void`
  - Render header row: "(The path)" label, pace text, "Expand all" and "Collapse all" pills (both are `<button>` elements with `aria-label`)
  - Render 6 segments in a horizontal `flex` row; each: colored top bar (orange if done/in-progress, `#302923` if upcoming), stage number, week label, name, topic count
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 12.3_

- [ ] 8. Implement `TopicRow` component
  - Create `src/components/roadmap/TopicRow.tsx`
  - Props: `topic: TopicData`
  - Render check circle (26×26): done = orange bg + white ✓; in-progress = border + orange dot; not-started = empty border; locked = faded border
  - Add `aria-label` to the circle indicating status
  - Render title (flex-1): `#fff8ee` for active, `#827a73` for done/locked
  - Render "Needs: Stage XX" pill when `topic.needsStage` is set
  - Render difficulty slot (130px) using `getDifficultyLabel`
  - Render time slot (60px, right-aligned) using `formatTime`
  - Render action slot (90px): "Review" text | "Start →" orange pill | empty, derived from `getTopicActionLabel`
  - Row padding: `px-32 py-20`, border-top `#302923`, gap-20
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 12.5_

- [ ] 9. Implement `CheckpointRow` component
  - Create `src/components/roadmap/CheckpointRow.tsx`
  - Props: `checkpoint: CheckpointData`
  - Apply warm dark background `rgba(74,27,12,0.35)`, border-top `#302923`, padding `px-32 py-24`, gap-24
  - Render "CHECKPOINT" label: 11px semibold `#ff6a00`, tracking 1.32px
  - Render task description: 20px medium `#fff8ee`
  - Render time estimate: 14px `#b6ada4`
  - Render status pill: done = bg `#4a1b0c` text `#ffd0a3` "✓ Done"; pending = border `#302923` text `#fff8ee` "See brief →"
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 10. Implement `StageCard` component
  - Create `src/components/roadmap/StageCard.tsx`
  - Props: `stage: StageData`, `isOpen: boolean`, `onToggle: () => void`
  - Card: bg `#11100f`, border `#302923`, rounded-24px, overflow-hidden
  - Header row (p-32, gap-24): stage number label, title block (name 30px + subtitle + "BY THE END" inline), progress fraction + 96px progress bar (h-4), toggle button "−"/"+" with descriptive `aria-label`
  - Optional prerequisite pill (border `#302923`, `#827a73`) or "✓ Done" pill (bg `#4a1b0c`, text `#ffd0a3`)
  - Collapsible body: render `<TopicRow />` for each topic and `<CheckpointRow />` for each checkpoint; animate via `max-height` CSS transition
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 12.1_

- [ ]* 10.1 Write unit test for `StageCard` accordion behavior
  - Render with `isOpen={true}` and assert topic rows are visible
  - Render with `isOpen={false}` and assert topic rows are not visible
  - Assert toggle button click calls `onToggle`
  - _Requirements: 4.5, 4.6_

- [ ] 11. Implement `CompletionCard` component
  - Create `src/components/roadmap/CompletionCard.tsx`
  - Props: `completedTopics: number`, `totalTopics: number`
  - Render "(The finish line)" label (12px `#827a73`)
  - Render "Now go ship it." heading (`#fff8ee`)
  - Render subtitle text
  - Render 3 buttons: primary "Join the Weekly Challenge →" (bg `#ff6a00`, text `#080808`), secondary "Share your progress" (border `#302923`), disabled "Challenge opens after beta" (dim, `disabled` attribute)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 12. Assemble `RoadmapDetailPage`
  - Replace the entire content of `src/pages/RoadmapDetailPage.tsx`
  - Remove `useQuery`, `getRoadmap`, `ArrowLeft`, and `Spinner` imports
  - Import `ROADMAP_DATA` and `computeProgress` from the data/utils files
  - Import all section components
  - Manage `expandedStages: Set<number>` state initialised with all 6 stage IDs
  - Implement `toggleStage`, `expandAll`, `collapseAll` handlers
  - Render in order: `<PageHeader>`, `<BeforeYouStartSection>`, `<ThePathTimeline>`, stage cards loop with `<QuoteDivider>` between stages, `<CompletionCard>`
  - Apply full-page background `#080808` with appropriate horizontal padding
  - _Requirements: 1.5, 2.1, 4.1, 4.3, 4.4, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ]* 12.1 Write property test for accordion toggle round-trip
  - **Property 6: Accordion toggle round-trip** — for any stage ID in [1..6], toggling a present ID removes it; toggling again restores it
  - Use fast-check `fc.constantFrom` to generate stage IDs
  - Test the toggle logic in isolation (pure function extracted from state handler)
  - _Requirements: 4.2_

- [ ]* 12.2 Write integration test for `RoadmapDetailPage`
  - Render the full page with testing-library
  - Assert all 6 stage cards are in the DOM
  - Assert computed percentage is shown in ProgressCard
  - Assert "Expand all" triggers all stages to be visible; "Collapse all" hides them
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 13. Implement responsive layout
  - Audit each multi-column section and add responsive breakpoints per Requirement 11.7
  - `PageHeader` left/right split → stack at `< md`
  - `BeforeYouStartSection` 3-card row → `flex-col` at `< md`
  - `ThePathTimeline` 6-segment row → horizontal scroll or 2-column grid at `< md`
  - _Requirements: 11.7_

- [ ] 14. Final checkpoint — Ensure all tests pass
  - Run `npm run test:run` and confirm all property tests, unit tests, and integration tests pass.
  - Run `npm run typecheck` and confirm zero TypeScript errors.
  - Ask the user if any questions arise before considering the feature complete.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `fast-check` must be installed as a dev dependency before running property tests: `npm install --save-dev fast-check`
- All components live under `src/components/roadmap/` (new directory) to keep them grouped
- The existing `AppLayout` (Navbar + Footer) wraps this page automatically via the router — no changes to `App.tsx` or `router.tsx` are needed
- The `RequireAuth` wrapper in the router is preserved unchanged
- Checkpoints ensure incremental validation at logical milestones
- Property tests validate universal correctness of the pure utility functions
- Unit/integration tests validate specific rendering behavior

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2.1", "2.3", "2.4", "2.5"] },
    { "wave": 3, "tasks": ["2.2", "2.6", "3"] },
    { "wave": 4, "tasks": ["4", "6", "7", "8", "9"] },
    { "wave": 5, "tasks": ["5", "10", "11"] },
    { "wave": 6, "tasks": ["10.1", "12"] },
    { "wave": 7, "tasks": ["12.1", "12.2", "13"] },
    { "wave": 8, "tasks": ["14"] }
  ]
}
```
