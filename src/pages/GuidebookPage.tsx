import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getRoadmap, getRoadmapProgress, getTopicContent, setTopicProgress } from '@/lib/endpoints'
import type { TopicStatus } from '@/lib/endpoints'
import { messageOf, statusOf } from '@/lib/api'
import { FullScreenLoader, Spinner } from '@/components/LoadingState'

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-0 mb-3 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-[#fff8ee] sm:mb-4 sm:text-[36px]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-2 text-[20px] font-medium leading-tight text-[#fff8ee] sm:mt-10 sm:mb-3 sm:text-[24px]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-[17px] font-medium text-[#fff8ee] sm:mt-8 sm:text-[19px]">{children}</h3>
  ),
  p: ({ children }) => <p className="my-3 text-[15px] leading-[26px] text-[#b6ada4] sm:my-4 sm:text-[16px] sm:leading-[28px]">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc pl-5 text-[15px] leading-[26px] text-[#b6ada4] sm:my-4 sm:pl-6 sm:text-[16px] sm:leading-[28px]">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal pl-5 text-[15px] leading-[26px] text-[#b6ada4] sm:my-4 sm:pl-6 sm:text-[16px] sm:leading-[28px]">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-[#fff8ee]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-[#ff8a4a] underline underline-offset-2 hover:text-[#ff6a00]">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-2 border-[#ff6a00] pl-4 text-[16px] italic leading-[26px] text-[#b6ada4] sm:my-6 sm:text-[18px] sm:leading-[30px]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[#1d1916] px-1.5 py-0.5 font-mono text-[13px] text-[#ffd0a3] sm:text-[14px]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-[14px] border border-[#302923] bg-[#11100f] p-3 text-[13px] sm:my-5 sm:rounded-[16px] sm:p-4 sm:text-[14px]">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-[#302923]" />,
  table: ({ children }) => (
    <table className="my-4 w-full border-collapse text-left text-[14px] text-[#b6ada4] sm:my-5 sm:text-[15px]">{children}</table>
  ),
  th: ({ children }) => (
    <th className="border-b border-[#302923] px-3 py-2 font-semibold text-[#fff8ee]">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-[#302923] px-3 py-2">{children}</td>,
}

export function GuidebookPage() {
  const { roadmapId = '', topicId = '' } = useParams()
  const queryClient = useQueryClient()

  const roadmap = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn: () => getRoadmap(roadmapId),
    enabled: Boolean(roadmapId),
  })

  const content = useQuery({
    queryKey: ['topic-content', roadmapId, topicId],
    queryFn: () => getTopicContent(roadmapId, topicId),
    enabled: Boolean(roadmapId && topicId),
  })

  const progress = useQuery({
    queryKey: ['roadmap', roadmapId, 'progress'],
    queryFn: () => getRoadmapProgress(roadmapId),
    enabled: Boolean(roadmapId),
  })

  const updateProgress = useMutation({
    mutationFn: (status: TopicStatus) => setTopicProgress(roadmapId, topicId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId, 'progress'] })
    },
  })

  const topic = roadmap.data?.topics.find((item) => item.id === topicId)
  const stage = roadmap.data?.stages.find((item) => item.position === topic?.stage)
  const status = progress.data?.find((entry) => entry.topicId === topicId)?.status

  useEffect(() => {
    if (status === 'not-started' && content.isSuccess) {
      updateProgress.mutate('in-progress')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.isSuccess])

  if (roadmap.isPending) {
    return <FullScreenLoader label="Loading topic…" />
  }

  if (roadmap.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-sm text-[#ff6a1a]">
          {messageOf(roadmap.error, 'Could not load this topic.')}
        </p>
        <Link
          to="/roadmaps"
          className="rounded-full border border-[#302923] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
        >
          Back to the roadmaps
        </Link>
      </div>
    )
  }

  const siblingTopics = roadmap.data?.topics ?? []
  const topicIndex = siblingTopics.findIndex((item) => item.id === topicId)
  const previous = topicIndex > 0 ? siblingTopics[topicIndex - 1] : undefined
  const next = topicIndex >= 0 ? siblingTopics[topicIndex + 1] : undefined

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white pt-20">
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-6 px-5 pb-16 pt-6 sm:gap-8 sm:px-12 sm:pb-24 sm:pt-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#827a73] sm:text-[12px]">
          <Link to="/roadmaps" className="hover:text-white">
            Roadmaps
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`/roadmaps/${roadmapId}`} className="hover:text-white">
            {roadmap.data?.title ?? 'Roadmap'}
          </Link>
          {stage && (
            <>
              <span aria-hidden="true">/</span>
              <span>{stage.title}</span>
            </>
          )}
        </nav>

        {/* Topic header */}
        <header className="flex flex-col gap-3">
          <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-[#fff8ee] sm:text-[36px]">
            {topic?.title ?? 'Topic'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#827a73] sm:gap-3 sm:text-[13px]">
            {stage && <span>{stage.title}</span>}
            {topic?.difficulty && <span>· {topic.difficulty}</span>}
            {topic?.estimatedMinutes ? <span>· {topic.estimatedMinutes} min</span> : null}
          </div>
        </header>

        {/* Document */}
        <article className="min-h-[200px]">
          {content.isPending && (
            <p className="flex items-center gap-2 text-sm text-[#827a73]">
              <Spinner /> Loading the document…
            </p>
          )}
          {content.isError && (
            <div className="rounded-[16px] border border-[#302923] bg-[#11100f] p-4 sm:rounded-[20px] sm:p-6">
              <p className="text-sm text-[#b6ada4]">
                {statusOf(content.error) === 503
                  ? 'Document storage is not configured yet, so this topic cannot be served.'
                  : 'This topic does not have a document yet.'}
              </p>
            </div>
          )}
          {content.isSuccess && (
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content.data}
            </Markdown>
          )}
        </article>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[#302923] pt-6">
          <button
            type="button"
            disabled={updateProgress.isPending}
            onClick={() => updateProgress.mutate('done')}
            className="rounded-full bg-[#ff6a00] px-4 py-2 text-[13px] font-semibold text-[#080808] transition-opacity hover:opacity-90 disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            {status === 'done' ? 'Completed ✓' : 'Mark as done'}
          </button>
          <button
            type="button"
            disabled={updateProgress.isPending || status === 'in-progress'}
            onClick={() => updateProgress.mutate('in-progress')}
            className="rounded-full border border-[#302923] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04] disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            {status === 'in-progress' ? 'In progress' : 'Start reading'}
          </button>
          {updateProgress.isError && (
            <span className="text-[13px] text-[#ff6a1a]">
              {messageOf(updateProgress.error, 'Could not save your progress.')}
            </span>
          )}
        </div>

        {/* Previous / next */}
        <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-[#302923] pt-6 text-[13px]">
          {previous ? (
            <Link to={`/guidebook/${roadmapId}/${previous.id}`} className="text-[#b6ada4] hover:text-white">
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/guidebook/${roadmapId}/${next.id}`} className="text-[#b6ada4] hover:text-white">
              {next.title} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
