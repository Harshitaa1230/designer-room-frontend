import './seam.css'

/**
 * SectionSeam
 *
 * A zero-height anchor element that renders a glassmorphism transition
 * straddling the boundary between two sections. Mount it between the hero
 * wrapper and the next section in the DOM.
 *
 * Tuneable via CSS variables (override on :root or inline style):
 *   --seam-height          total height of the seam          (default 200px)
 *   --seam-blur-max        maximum backdrop-filter blur       (default 28px)
 *   --seam-tint-opacity    opacity of the bottom tint fill    (default 0.80)
 *   --seam-blob-opacity    opacity of the drifting blob       (default 0.22)
 */
export const SectionSeam = () => (
  <div className="seam-root" aria-hidden="true">
    <div className="seam-overlay">
      {/* Drifting colour blob — sampled from hero palette, sits under glass */}
      <div className="seam-blob" />

      {/* Progressive blur layers — 2px → 6 → 12 → 20 → max */}
      <div className="seam-blur-layer seam-blur-1" />
      <div className="seam-blur-layer seam-blur-2" />
      <div className="seam-blur-layer seam-blur-3" />
      <div className="seam-blur-layer seam-blur-4" />
      <div className="seam-blur-layer seam-blur-5" />

      {/* Glass tint — hero colours → page background */}
      <div className="seam-tint" />

      {/* 1px top highlight */}
      <div className="seam-highlight" />
    </div>
  </div>
)
