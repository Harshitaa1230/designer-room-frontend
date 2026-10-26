import { Link } from 'react-router-dom'
import type { Topic, TopicMetadata } from '@/lib/endpoints'

interface TopicDetailsProps {
  metadata: TopicMetadata | null
  roadmapId: string
  topics: Topic[]
}

export function TopicDetails({ metadata, roadmapId, topics }: TopicDetailsProps) {
  if (!metadata) {
    return null
  }

  const findBySlug = (slug: string | null | undefined) =>
    slug ? topics.find((topic) => topic.slug === slug) : undefined

  const upNext = findBySlug(metadata.upNext)
  const related = (metadata.related ?? [])
    .map((slug) => findBySlug(slug))
    .filter((topic): topic is Topic => Boolean(topic))

  const hasDetails =
    Boolean(metadata.needs?.length) ||
    Boolean(metadata.youllNeed) ||
    Boolean(metadata.practise) ||
    Boolean(upNext) ||
    Boolean(metadata.upNextLabel) ||
    related.length > 0

  if (!hasDetails) {
    return null
  }

  return (
    <section className="rounded-[18px] border border-[#302923] bg-[#11100f] p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.16em] text-[#827a73] sm:text-[11px]">
        <span>{metadata.level ?? 'Beginner'}</span>
        {metadata.timeMinutes ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{metadata.timeMinutes} min</span>
          </>
        ) : null}
      </div>

      {metadata.needs?.length ? (
        <p className="mt-3 text-[13px] leading-6 text-[#b6ada4] sm:text-[14px]">
          <span className="font-medium text-[#fff8ee]">Needs:</span>{' '}
          {metadata.needs.join(', ')}
        </p>
      ) : null}

      {metadata.youllNeed ? (
        <p className="mt-2 text-[13px] leading-6 text-[#b6ada4] sm:text-[14px]">
          <span className="font-medium text-[#fff8ee]">You&apos;ll need:</span>{' '}
          {metadata.youllNeed}
        </p>
      ) : null}

      {metadata.practise ? (
        <div className="mt-4 rounded-[12px] border border-[#3a2c22] bg-[#1a130e] px-3 py-3 sm:px-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#ff8a4a] sm:text-[11px]">
            Practise this
          </p>
          <p className="mt-1 text-[13px] leading-6 text-[#d8cfc4] sm:text-[14px]">
            {metadata.practise}
          </p>
        </div>
      ) : null}

      {upNext || metadata.upNextLabel || related.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#302923] pt-3 text-[12px] text-[#b6ada4] sm:text-[13px]">
          {upNext ? (
            <Link
              to={`/guidebook/${roadmapId}/${upNext.id}`}
              className="text-[#ff8a4a] hover:text-[#ff6a00]"
            >
              Up next: {upNext.title}
            </Link>
          ) : metadata.upNextLabel ? (
            <span className="text-[#827a73]">Up next: {metadata.upNextLabel}</span>
          ) : null}

          {related.length > 0 ? (
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[#827a73]">Related:</span>
              {related.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/guidebook/${roadmapId}/${topic.id}`}
                  className="text-[#d8cfc4] underline underline-offset-2 hover:text-white"
                >
                  {topic.title}
                </Link>
              ))}
            </span>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
