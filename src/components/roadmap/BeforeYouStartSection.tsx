import type { BeforeYouStartCard } from '@/lib/endpoints'

interface BeforeYouStartSectionProps {
  cards: BeforeYouStartCard[]
}

export default function BeforeYouStartSection({ cards }: BeforeYouStartSectionProps) {
  return (
    <section className="px-5 sm:px-12 md:px-16 py-[32px] sm:py-[48px] flex flex-col gap-[18px] sm:gap-[24px]">
      {/* Section label */}
      <span className="text-[12px] text-[var(--text-muted)]">(Before you start)</span>

      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[16px] items-stretch">
        {cards.map((card, index) => (
          <div
            key={index}
            className="min-w-0 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[16px] sm:rounded-[20px] p-[20px] sm:p-[28px] flex flex-col gap-[12px] sm:gap-[14px]"
          >
            {/* Colored heading */}
            <p className="text-[12px] font-semibold text-[var(--accent-label)] tracking-[1.44px]">
              {card.colorLabel}
            </p>

            {/* Title */}
            <p className="text-[18px] sm:text-[22px] font-medium text-[var(--text-primary)] leading-[26px] sm:leading-[28px] tracking-[-0.11px]">
              {card.title}
            </p>

            {/* Bullet list */}
            <div className="flex flex-col gap-[14px]">
              {card.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-[10px] items-start">
                  <span className="text-[var(--accent-text)] text-[15px] shrink-0">•</span>
                  <span className="text-[var(--text-body)] text-[14px] sm:text-[15px] leading-normal break-words">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
