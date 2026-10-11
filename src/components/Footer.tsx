export const Footer = () => {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-4 pb-12">
      <div className="flex flex-col items-center justify-between gap-4 text-xs font-normal text-zinc-500 sm:flex-row">
        <p>© Copyright 2024. All Rights Reserved</p>

        <div className="flex items-center gap-6">
          <a href="#privacy" className="transition-colors hover:text-zinc-300">
            Privacy Policy
          </a>
          <a href="#terms" className="transition-colors hover:text-zinc-300">
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  )
}
