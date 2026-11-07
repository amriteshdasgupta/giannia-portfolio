/**
 * Shared SVG filters, rendered once per page by the root layout.
 *
 * cp-deckle  grows an off-white backing out of a sticker's own alpha, tears its
 *            edge, and lays a soft lifted shadow under it. The drawing
 *            (SourceGraphic) is composited on top untouched.
 * cp-torn    tears the edge of a flat paper shape (chips, tabs, arrows).
 * cp-crayon  wobbles a stroke and lets the paper tooth show through it.
 */
export function PaperFilters() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="cp-deckle" x="-8%" y="-8%" width="116%" height="118%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="grown" />
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="11" result="tear" />
          <feDisplacementMap in="grown" in2="tear" scale="13" xChannelSelector="R" yChannelSelector="G" result="torn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4" result="fibre" />
          <feDisplacementMap in="torn" in2="fibre" scale="3.5" xChannelSelector="G" yChannelSelector="R" result="edge" />
          <feFlood floodColor="#fdf9f0" />
          <feComposite in2="edge" operator="in" result="sheet" />
          <feGaussianBlur in="edge" stdDeviation="6" />
          <feOffset dx="1" dy="5" result="lift" />
          <feFlood floodColor="#4a3218" floodOpacity="0.2" />
          <feComposite in2="lift" operator="in" result="shadow" />
          <feGaussianBlur in="edge" stdDeviation="0.8" />
          <feOffset dy="1" result="touch" />
          <feFlood floodColor="#3a2a14" floodOpacity="0.2" />
          <feComposite in2="touch" operator="in" result="contact" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="contact" />
            <feMergeNode in="sheet" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cp-torn" x="-10%" y="-20%" width="120%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="7" result="tear" />
          <feDisplacementMap in="SourceGraphic" in2="tear" scale="6" xChannelSelector="R" yChannelSelector="G" result="paper" />
          <feGaussianBlur in="paper" stdDeviation="2.2" />
          <feOffset dy="2" result="lift" />
          <feFlood floodColor="#4a3218" floodOpacity="0.2" />
          <feComposite in2="lift" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="paper" />
          </feMerge>
        </filter>

        <filter id="cp-crayon" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="2" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="wobble" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="9" result="tooth" />
          <feColorMatrix in="tooth" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.6" result="wax" />
          <feComposite in="wobble" in2="wax" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}
