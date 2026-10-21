import { Link } from 'react-router-dom'

export const Hero = () => {
  return (
    <section className="hero relative overflow-hidden px-6 pt-40 pb-32 md:pt-48 md:pb-40">
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
        <h1 className="text-5xl leading-[1.08] font-semibold tracking-[-0.035em] text-[#fffaee] [text-wrap:balance] sm:text-6xl md:text-7xl lg:text-[84px]">
          <span className="block">Your design journey,</span>
          <span className="mt-1 block">all in one room.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-[940px] text-base font-[450] leading-relaxed tracking-normal text-white [text-shadow:0_1px_14px_rgba(0,0,0,.4)] [text-wrap:pretty] sm:text-lg md:text-xl">
          Everything that took us years to figure out, organized in one place. Structured roadmaps,
          <br className="hidden sm:inline" />
          theory without the fluff, challenges that build your portfolio, and a community to grow
          with.
        </p>

        {/* CTAs — mb-2 reserves room for the 3D edge shadow */}
        <div className="mt-8 mb-2 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="btn-3d inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm"
          >
            Start Practising →
          </Link>
          <Link
            to="/roadmaps"
            className="btn-3d-ghost inline-flex items-center justify-center px-6 py-3.5 text-sm"
          >
            Browse Guidebook
          </Link>
        </div>
      </div>
    </section>
  )
}
