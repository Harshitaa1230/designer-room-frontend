import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getRoadmap, getRoadmapProgress } from '@/lib/endpoints'
import { messageOf } from '@/lib/api'
import { buildStageViews, computeProgress } from '@/data/roadmapUtils'
import PageHeader from '@/components/roadmap/PageHeader'
import BeforeYouStartSection from '@/components/roadmap/BeforeYouStartSection'
import ThePathTimeline from '@/components/roadmap/ThePathTimeline'
import { StageCard } from '@/components/roadmap/StageCard'
import CompletionCard from '@/components/roadmap/CompletionCard'
import { FullScreenLoader, Spinner } from '@/components/LoadingState'

export function RoadmapDetailPage() {
  const { id = '' } = useParams()
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set())

  const roadmap = useQuery({
    queryKey: ['roadmap', id],
    queryFn: () => getRoadmap(id),
    enabled: Boolean(id),
  })

  const progress = useQuery({
    queryKey: ['roadmap', id, 'progress'],
    queryFn: () => getRoadmapProgress(id),
    enabled: Boolean(id),
  })

  const stageViews = useMemo(
    () =>
      roadmap.data
        ? buildStageViews(roadmap.data.stages, roadmap.data.topics, progress.data ?? [])
        : [],
    [roadmap.data, progress.data],
  )

  const isExpanded = (stageId: string) => !collapsedStages.has(stageId)

  function toggleStage(stageId: string) {
    setCollapsedStages((prev) => {
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
    setCollapsedStages(new Set())
  }

  function collapseAll() {
    setCollapsedStages(new Set(stageViews.map((stage) => stage.id)))
  }

  if (roadmap.isPending) {
    return <FullScreenLoader label="Loading roadmap…" />
  }

  if (roadmap.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="text-sm text-[#ff6a1a]">
          {messageOf(roadmap.error, 'Could not load this roadmap.')}
        </p>
        <button
          type="button"
          onClick={() => void roadmap.refetch()}
          className="rounded-full border border-[#302923] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
        >
          Try again
        </button>
      </div>
    )
  }

  const data = roadmap.data
  const overview = computeProgress(stageViews)
  const continueTopicId = stageViews
    .flatMap((stage) => stage.topics)
    .find((topic) => topic.status === 'in-progress')?.id
  const quotes = data.metadata?.quotes ?? []

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white pt-20">
      <PageHeader
        title={data.title}
        metadata={data.metadata}
        progress={overview}
        roadmapId={data.id}
        continueTopicId={continueTopicId}
      />
      <BeforeYouStartSection cards={data.metadata?.beforeYouStart ?? []} />
      <ThePathTimeline
        stages={stageViews}
        pace={data.metadata?.timelinePace ?? ''}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      {/* Stages section */}
      <div className="px-8 sm:px-12 md:px-16 py-[48px] flex flex-col gap-[16px]">
        {stageViews.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-[#827a73]">
            <Spinner /> This roadmap has no stages yet.
          </p>
        )}
        {stageViews.map((stage, index) => (
          <div key={stage.id}>
            <StageCard
              stage={stage}
              roadmapId={data.id}
              isOpen={isExpanded(stage.id)}
              onToggle={() => toggleStage(stage.id)}
            />
            {/* Quote divider between stages */}
            {index < stageViews.length - 1 && quotes[index] && (
              <div className="py-[48px] flex flex-col items-center gap-[16px]">
                <div className="w-[32px] h-[2px] bg-[#302923] rounded-full" />
                <p className="text-[20px] font-medium text-[#b6ada4] text-center max-w-[720px] leading-relaxed tracking-[-0.1px] italic">
                  "{quotes[index]}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <CompletionCard
        completedTopics={overview.completedTopics}
        totalTopics={overview.totalTopics}
      />
    </div>
  )
}
