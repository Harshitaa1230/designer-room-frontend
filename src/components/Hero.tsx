import { Link } from 'react-router-dom'

export const Hero = () => {
  return (
    <section className="hero relative overflow-hidden px-6 pt-36 pb-24 sm:pt-40 sm:pb-32 md:pt-48 md:pb-40">
      {/* Ambient arc — dark mode: cutout uses #080808; light mode: #f5f4f0.
          No overflow-hidden here: clipping the blurred blobs at this box's edge
          caused a visible vertical seam (blur cut hard at the clip boundary). */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[550px] w-[650px] select-none md:-right-12 md:h-[750px] md:w-[950px] lg:w-[1100px]"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 h-full w-full rounded-full bg-[radial-gradient(ellipse_at_70%_25%,#ff5722_0%,#c2410c_35%,#7c2d12_55%,transparent_75%)] opacity-60 blur-[100px] filter" />
        <div className="animate-ambient-glow absolute top-10 right-4 h-[350px] w-[450px] rounded-full bg-[radial-gradient(circle_at_65%_35%,#ff7a29_10%,#ea580c_35%,#9a3412_60%,transparent_75%)] opacity-85 blur-[60px] filter md:right-16 md:h-[550px] md:w-[700px]" />
        <div className="absolute top-16 right-10 h-[200px] w-[280px] rounded-full bg-[radial-gradient(ellipse_at_60%_30%,#ffa24c_0%,#ea580c_50%,transparent_70%)] opacity-70 blur-[40px] filter md:right-32 md:h-[300px] md:w-[420px]" />
        {/* Cut-out that carves the crescent — matches page background */}
        <div className="absolute top-36 right-36 h-[260px] w-[360px] rounded-full bg-[var(--bg-page)] opacity-95 blur-[50px] filter md:right-64 md:h-[400px] md:w-[540px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="mx-auto max-w-[300px] text-[34px] leading-[1.12] font-semibold tracking-[-0.03em] text-[#fffaee] [text-wrap:balance] sm:max-w-none sm:text-5xl sm:leading-[1.08] md:text-7xl lg:text-[84px]">
          <span className="block">Your design journey,</span>
          <span className="mt-0.5 block">all in one room.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-[325px] text-[13px] leading-[1.64] font-[450] tracking-normal text-white/95 [text-shadow:0_1px_14px_rgba(0,0,0,.4)] [text-wrap:pretty] sm:mt-7 sm:max-w-[940px] sm:text-base sm:leading-relaxed md:text-lg lg:text-xl">
          Everything that took us years to figure out, organized in one place. Structured roadmaps,
          <br className="hidden sm:inline" />
          theory without the fluff, challenges that build your portfolio, and a community to grow
          with.
        </p>

        {/* CTAs — mb-2 reserves room for the 3D edge shadow */}
        <div className="mt-8 mb-2 flex flex-row items-center justify-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="btn-3d inline-flex items-center justify-center gap-1.5 px-3 py-3 text-xs whitespace-nowrap sm:gap-2 sm:px-6 sm:py-3.5 sm:text-sm"
          >
            Start Practising →
          </Link>
          <Link
            to="/roadmaps"
            className="btn-3d-ghost inline-flex items-center justify-center px-3 py-3 text-xs whitespace-nowrap sm:px-6 sm:py-3.5 sm:text-sm"
          >
            Browse Guidebook
          </Link>
        </div>
      </div>
    </section>
  )
}
