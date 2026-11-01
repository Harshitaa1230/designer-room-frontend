import { useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getRoadmap, getRoadmapProgress, getTopicContent, setTopicProgress } from '@/lib/endpoints'
import type { ProgressEntry, TopicStatus } from '@/lib/endpoints'
import { messageOf, statusOf } from '@/lib/api'
import { rememberAuthRedirect } from '@/lib/authRedirect'
import { clearPendingProgress, readPendingProgress, rememberPendingProgress } from '@/lib/progressIntent'
import { findPreviewTopicId } from '@/data/roadmapUtils'
import { useAuthStore } from '@/store/auth'
import { FullScreenLoader, Spinner } from '@/components/LoadingState'
import { TopicDetails } from '@/components/roadmap/TopicDetails'
import { TopicQuiz } from '@/components/roadmap/TopicQuiz'

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-0 mb-3 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:mb-4 sm:text-[36px]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-2 text-[20px] font-medium leading-tight text-[var(--text-primary)] sm:mt-10 sm:mb-3 sm:text-[24px]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-[17px] font-medium text-[var(--text-primary)] sm:mt-8 sm:text-[19px]">{children}</h3>
  ),
  p: ({ children }) => <p className="my-3 text-[15px] leading-[26px] text-[var(--text-body)] sm:my-4 sm:text-[16px] sm:leading-[28px]">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc pl-5 text-[15px] leading-[26px] text-[var(--text-body)] sm:my-4 sm:pl-6 sm:text-[16px] sm:leading-[28px]">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal pl-5 text-[15px] leading-[26px] text-[var(--text-body)] sm:my-4 sm:pl-6 sm:text-[16px] sm:leading-[28px]">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-[var(--accent-text)] underline underline-offset-2 hover:text-[var(--accent-strong)]">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-2 border-[var(--accent-text)] pl-4 text-[16px] italic leading-[26px] text-[var(--text-body)] sm:my-6 sm:text-[18px] sm:leading-[30px]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[var(--bg-inset)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--accent-soft-text)] sm:text-[14px]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 text-[13px] sm:my-5 sm:rounded-[16px] sm:p-4 sm:text-[14px]">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-[var(--border-subtle)]" />,
  table: ({ children }) => (
    <table className="my-4 w-full border-collapse text-left text-[14px] text-[var(--text-body)] sm:my-5 sm:text-[15px]">{children}</table>
  ),
  th: ({ children }) => (
    <th className="border-b border-[var(--border-subtle)] px-3 py-2 font-semibold text-[var(--text-primary)]">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-[var(--border-subtle)] px-3 py-2">{children}</td>,
}

export function GuidebookPage() {
  const { roadmapId = '', topicId = '' } = useParams()
  const authStatus = useAuthStore((state) => state.status)
  const userId = useAuthStore((state) => state.user?.id ?? '')
  const queryClient = useQueryClient()
  const location = useLocation()
  const navigate = useNavigate()
  const autoStarted = useRef(new Set<string>())
  const pendingApplied = useRef(false)

  const roadmap = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn: () => getRoadmap(roadmapId),
    enabled: Boolean(roadmapId),
  })

  const previewTopicId = roadmap.data
    ? findPreviewTopicId(roadmap.data.stages, roadmap.data.topics)
    : undefined
  const isPreviewTopic = Boolean(roadmap.data && previewTopicId === topicId)
  const canAccess = authStatus === 'authed' || isPreviewTopic

  const content = useQuery({
    queryKey: ['topic-content', roadmapId, topicId],
    queryFn: () => getTopicContent(roadmapId, topicId),
    enabled: Boolean(roadmapId && topicId && canAccess),
  })

  const progress = useQuery({
    queryKey: ['roadmap', roadmapId, 'progress', userId],
    queryFn: () => getRoadmapProgress(roadmapId),
    enabled: Boolean(roadmapId && userId),
    refetchOnMount: 'always',
  })

  const updateProgress = useMutation({
    mutationFn: (status: TopicStatus) => setTopicProgress(roadmapId, topicId, status),
    onSuccess: (entry) => {
      queryClient.setQueryData<ProgressEntry[]>(['roadmap', roadmapId, 'progress', userId], (current) => [
        ...(current ?? []).filter((item) => item.topicId !== entry.topicId),
        entry,
      ])
      void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId, 'progress', userId] })
    },
  })

  const topic = roadmap.data?.topics.find((item) => item.id === topicId)
  const stage = roadmap.data?.stages.find((item) => item.position === topic?.stage)
  const status = progress.data?.find((entry) => entry.topicId === topicId)?.status

  useEffect(() => {
    if (!topic) {
      return
    }

    const metadata = topic.metadata
    document.title = metadata?.seoTitle ?? `${topic.title} · Designers Room`

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = metadata?.seoDescription ?? ''
  }, [topic])

  useEffect(() => {
    if (authStatus !== 'guest' || !roadmap.data || topicId === previewTopicId) {
      return
    }
    const redirect = `${location.pathname}${location.search}${location.hash}`
    rememberAuthRedirect(redirect)
    navigate(`/login?redirect=${encodeURIComponent(redirect)}`, { replace: true })
  }, [authStatus, location, navigate, previewTopicId, roadmap.data, topicId])

  useEffect(() => {
    if (!content.isSuccess || !progress.isSuccess || !topic) {
      return
    }
    if (status && status !== 'not-started') {
      return
    }
    const pending = readPendingProgress()
    if (pending?.roadmapId === roadmapId && pending.topicId === topicId) {
      return
    }
    if (autoStarted.current.has(topicId)) {
      return
    }
    autoStarted.current.add(topicId)
    updateProgress.mutate('in-progress')
  }, [content.isSuccess, progress.isSuccess, status, topic, topicId, updateProgress, roadmapId])

  useEffect(() => {
    if (authStatus !== 'authed' || !progress.isSuccess || !topic || pendingApplied.current) {
      return
    }
    const pending = readPendingProgress()
    if (!pending || pending.roadmapId !== roadmapId || pending.topicId !== topicId) {
      return
    }
    if (status === 'done') {
      clearPendingProgress()
      return
    }
    pendingApplied.current = true
    updateProgress.mutate('done', {
      onSuccess: () => {
        clearPendingProgress()
        pendingApplied.current = false
      },
    })
  }, [authStatus, progress.isSuccess, status, topic, updateProgress, roadmapId, topicId])

  if (authStatus === 'restoring' || roadmap.isPending) {
    return <FullScreenLoader label="Loading topic…" />
  }

  if (roadmap.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-sm text-[var(--accent-text)]">
          {messageOf(roadmap.error, 'Could not load this topic.')}
        </p>
        <Link
          to="/guidebook"
          className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
        >
          Back to the roadmaps
        </Link>
      </div>
    )
  }

  if (authStatus === 'guest' && !isPreviewTopic) {
    return <FullScreenLoader label="Sign in to keep reading…" />
  }

  const siblingTopics = roadmap.data?.topics ?? []
  const topicIndex = siblingTopics.findIndex((item) => item.id === topicId)
  const previous = topicIndex > 0 ? siblingTopics[topicIndex - 1] : undefined
  const next = topicIndex >= 0 ? siblingTopics[topicIndex + 1] : undefined

  function openLogin() {
    const redirect = `${location.pathname}${location.search}${location.hash}`
    rememberAuthRedirect(redirect)
    navigate(`/login?redirect=${encodeURIComponent(redirect)}`)
  }

  function saveProgress(nextStatus: TopicStatus) {
    if (authStatus !== 'authed') {
      if (nextStatus === 'done') {
        rememberPendingProgress({ roadmapId, topicId, status: 'done' })
      }
      openLogin()
      return
    }
    updateProgress.mutate(nextStatus)
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-page)] text-[var(--text-primary)] pt-20">
      <div className="flex w-full flex-col gap-6 px-5 pb-16 pt-6 sm:gap-8 sm:px-8 sm:pb-24 sm:pt-10 lg:px-16 2xl:px-24">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--text-muted)] sm:text-[12px]">
          <Link to="/guidebook" className="hover:text-[var(--text-primary)]">
            Roadmaps
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`/guidebook/${roadmapId}`} className="hover:text-[var(--text-primary)]">
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
          <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[36px]">
            {topic?.title ?? 'Topic'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-muted)] sm:gap-3 sm:text-[13px]">
            {stage && <span>{stage.title}</span>}
            {topic?.difficulty && <span>· {topic.difficulty}</span>}
            {topic?.estimatedMinutes ? <span>· {topic.estimatedMinutes} min</span> : null}
          </div>
        </header>

        <TopicDetails
          metadata={topic?.metadata ?? null}
          roadmapId={roadmapId}
          topics={siblingTopics}
        />

        {/* Document */}
        <article className="min-h-[200px]">
          {content.isPending && (
            <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Spinner /> Loading the document…
            </p>
          )}
          {content.isError && (
            <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:rounded-[20px] sm:p-6">
              <p className="text-sm text-[var(--text-body)]">
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

        {topic?.metadata?.quiz?.length ? <TopicQuiz questions={topic.metadata.quiz} /> : null}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-6">
          <button
            type="button"
            disabled={updateProgress.isPending}
            onClick={() => saveProgress('done')}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            {status === 'done' ? 'Done ✓' : 'Mark as done'}
          </button>
          <button
            type="button"
            disabled={updateProgress.isPending || status === 'in-progress'}
            onClick={() => saveProgress('in-progress')}
            className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            {status === 'in-progress' ? 'In progress' : 'Start reading'}
          </button>
          {updateProgress.isError && (
            <span className="text-[13px] text-[var(--accent-text)]">
              {messageOf(updateProgress.error, 'Could not save your progress.')}
            </span>
          )}
        </div>

        {/* Previous / next */}
        <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 text-[13px]">
          {previous ? (
            <Link to={`/guidebook/${roadmapId}/${previous.id}`} className="text-[var(--text-body)] hover:text-[var(--text-primary)]">
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/guidebook/${roadmapId}/${next.id}`} className="text-[var(--text-body)] hover:text-[var(--text-primary)]">
              {next.title} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
