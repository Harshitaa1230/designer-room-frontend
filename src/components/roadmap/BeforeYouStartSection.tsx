import type { BeforeYouStartCard } from '@/data/roadmapData'

interface BeforeYouStartSectionProps {
  cards: BeforeYouStartCard[]
}

export default function BeforeYouStartSection({ cards }: BeforeYouStartSectionProps) {
  return (
    <section className="px-8 sm:px-12 md:px-16 py-[48px] flex flex-col gap-[24px]">
      {/* Section label */}
      <span className="text-[12px] text-[#827a73]">(Before you start)</span>

      {/* Cards row */}
      <div className="flex flex-col md:flex-row gap-[16px] items-stretch">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-1 min-w-0 bg-[#11100f] border border-[#302923] rounded-[20px] p-[28px] flex flex-col gap-[14px]"
          >
            {/* Colored heading */}
            <p className="text-[12px] font-semibold text-[#ff6a00] tracking-[1.44px]">
              {card.colorLabel}
            </p>

            {/* Title */}
            <p className="text-[22px] font-medium text-[#fff8ee] leading-[28px] tracking-[-0.11px]">
              {card.title}
            </p>

            {/* Bullet list */}
            <div className="flex flex-col gap-[14px]">
              {card.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-[10px] items-start">
                  <span className="text-[#ff6a00] text-[15px] shrink-0">•</span>
                  <span className="text-[#b6ada4] text-[15px] leading-normal">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
