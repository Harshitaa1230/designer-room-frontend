import { useState } from 'react'
import { ROADMAP_DATA } from '@/data/roadmapData'
import { computeProgress } from '@/data/roadmapUtils'
import PageHeader from '@/components/roadmap/PageHeader'
import BeforeYouStartSection from '@/components/roadmap/BeforeYouStartSection'
import ThePathTimeline from '@/components/roadmap/ThePathTimeline'
import { StageCard } from '@/components/roadmap/StageCard'
import CompletionCard from '@/components/roadmap/CompletionCard'

const ALL_STAGE_IDS = new Set(ROADMAP_DATA.stages.map((s) => s.id))

export function RoadmapDetailPage() {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(
    () => new Set(ALL_STAGE_IDS)
  )

  const progress = computeProgress(ROADMAP_DATA.stages)

  function toggleStage(stageId: number) {
    setExpandedStages((prev) => {
      const next = new Set(prev)
      if (next.has(stageId)) {
        next.delete(stageId)
      } else {
        next.add(stageId)
      }
      return next
    })
  }

  function expandAll() {
    setExpandedStages(new Set(ALL_STAGE_IDS))
  }

  function collapseAll() {
    setExpandedStages(new Set())
  }

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white pt-20">
      <PageHeader roadmap={ROADMAP_DATA} progress={progress} />
      <BeforeYouStartSection cards={ROADMAP_DATA.beforeYouStart} />
      <ThePathTimeline
        stages={ROADMAP_DATA.stages}
        pace={ROADMAP_DATA.timelinePace}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      {/* Stages section */}
      <div className="px-8 sm:px-12 md:px-16 py-[48px] flex flex-col gap-[16px]">
        {ROADMAP_DATA.stages.map((stage, index) => (
          <div key={stage.id}>
            <StageCard
              stage={stage}
              isOpen={expandedStages.has(stage.id)}
              onToggle={() => toggleStage(stage.id)}
            />
            {/* Quote divider between stages */}
            {index < ROADMAP_DATA.stages.length - 1 && ROADMAP_DATA.quotes[index] && (
              <div className="py-[48px] flex flex-col items-center gap-[16px]">
                <div className="w-[32px] h-[2px] bg-[#302923] rounded-full" />
                <p className="text-[20px] font-medium text-[#b6ada4] text-center max-w-[720px] leading-relaxed tracking-[-0.1px] italic">
                  "{ROADMAP_DATA.quotes[index]}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <CompletionCard
        completedTopics={progress.completedTopics}
        totalTopics={progress.totalTopics}
      />
    </div>
  )
}
