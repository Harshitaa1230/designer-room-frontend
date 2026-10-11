export const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background Glowing Ambient Light Arc */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[550px] w-[650px] overflow-hidden select-none md:-right-12 md:h-[750px] md:w-[950px] lg:w-[1100px]"
        aria-hidden="true"
      >
        {/* Soft diffused outer orange halo */}
        <div className="absolute top-0 right-0 h-full w-full rounded-full bg-[radial-gradient(ellipse_at_70%_25%,#ff5722_0%,#c2410c_35%,#7c2d12_55%,transparent_75%)] opacity-60 blur-[100px] filter" />

        {/* Crisp luminous fiery arc / crescent layer */}
        <div className="animate-ambient-glow absolute top-10 right-4 h-[350px] w-[450px] rounded-full bg-[radial-gradient(circle_at_65%_35%,#ff7a29_10%,#ea580c_35%,#9a3412_60%,transparent_75%)] opacity-85 blur-[60px] filter md:right-16 md:h-[550px] md:w-[700px]" />

        {/* Hot center flare */}
        <div className="absolute top-16 right-10 h-[200px] w-[280px] rounded-full bg-[radial-gradient(ellipse_at_60%_30%,#ffa24c_0%,#ea580c_50%,transparent_70%)] opacity-70 blur-[40px] filter md:right-32 md:h-[300px] md:w-[420px]" />

        {/* Interior deep shadow cut-out to create the distinct curved ring/crescent contour */}
        <div className="absolute top-36 right-36 h-[260px] w-[360px] rounded-full bg-[#080808] opacity-95 blur-[50px] filter md:right-64 md:h-[400px] md:w-[540px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="text-4xl leading-[1.08] font-normal tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-[70px]">
          <span className="block">Your design journey,</span>
          <span className="mt-1 block">all in one room.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-[620px] text-sm leading-relaxed font-normal tracking-normal text-zinc-400 sm:text-[15px] md:text-base">
          Everything that took us years to figure out, organized in one place. Structured roadmaps,
          theory without the fluff, challenges that build your portfolio, and a community to grow
          with.
        </p>
      </div>
    </section>
  )
}
