// Giannia's works. Shared by all three directions (/trace, /cut-paper, /glazed).
//
// EVERYTHING HERE IS PLACEHOLDER. Titles, courses, years, notes and images are
// invented stand-ins until the real list arrives. To add a real work: drop its
// image in assets/works-raw/<slug>.png, run `python3 scripts/make-stickers.py`,
// and add an entry below.

export type Kind = "studio" | "model" | "sketch" | "writing" | "competition"

export type Section = {
  heading: string
  body: string
}

export type Work = {
  slug: string
  no: number
  title: string
  kind: Kind
  year: number
  /** Course, studio or brief the work came from */
  context: string
  /** Where the site is, when there is one */
  location?: string
  /** Medium or format: "chipboard, 1:50", "essay, 4,000 words" */
  medium: string
  collaborators?: string
  /** One sentence for the catalog */
  summary: string
  /** Her short handwritten note on the sticker */
  note: string
  featured?: boolean
  /** Detail page, read in order */
  sections: Section[]
}

export const kinds: { value: Kind; label: string; singular: string }[] = [
  { value: "studio", label: "Studio projects", singular: "Studio project" },
  { value: "model", label: "Models", singular: "Model" },
  { value: "sketch", label: "Sketches", singular: "Sketch" },
  { value: "writing", label: "Writing", singular: "Writing" },
  { value: "competition", label: "Competitions", singular: "Competition" },
]

export const kindLabel = (k: Kind) => kinds.find((x) => x.value === k)!.singular

/** Rectangular image (drawn on white), for frames and panes */
export const imageOf = (w: Pick<Work, "slug">) => `/works/${w.slug}.jpg`
/** Die-cut sticker with white kiss-cut border, transparent WebP */
export const stickerOf = (w: Pick<Work, "slug">) => `/works/sticker/${w.slug}.webp`

const placeholderSections = (brief: string, site: string, idea: string, reflection: string): Section[] => [
  { heading: "Brief", body: brief },
  { heading: "Site", body: site },
  { heading: "Idea", body: idea },
  { heading: "Reflection", body: reflection },
]

export const works: Work[] = [
  {
    slug: "bathhouse-canal",
    no: 1,
    title: "Bathhouse on the Canal",
    kind: "studio",
    year: 2025,
    context: "Studio III",
    location: "Canal district (placeholder)",
    medium: "watercolour, ink, 1:200 drawings",
    summary: "A public bathhouse that turns a working canal edge into a place to slow down.",
    note: "steam + stone + water at eye level",
    featured: true,
    sections: placeholderSections(
      "Design a small public building that gives something back to a neglected waterfront.",
      "A narrow plot between a brick bridge and a row of warehouses, facing south over the canal.",
      "The pools sit at water level so bathers see the canal at eye height; a long timber loggia shelters the route from street to water.",
      "What I would push further: the section through the changing rooms, and how the building reads at night.",
    ),
  },
  {
    slug: "threshold-library",
    no: 2,
    title: "Threshold Library",
    kind: "studio",
    year: 2024,
    context: "Studio II",
    location: "Neighbourhood park edge (placeholder)",
    medium: "render, plans, sections",
    summary: "A neighbourhood library built around the moment of arriving: porch, hall, reading room.",
    note: "three arches = three kinds of quiet",
    sections: placeholderSections(
      "A branch library for 5,000 residents with a children's room and evening study space.",
      "The corner of a park, with mature trees on two sides.",
      "Three arched bays step from the noisy street to the quiet reading room, each threshold a little calmer than the last.",
      "The arches did a lot of work; next time I would let the structure be lighter.",
    ),
  },
  {
    slug: "courtyard-housing",
    no: 3,
    title: "Courtyard Housing",
    kind: "studio",
    year: 2024,
    context: "Studio II, housing module",
    medium: "plan, 1:200",
    summary: "Twelve small homes around one shared courtyard and one tree.",
    note: "every front door sees the tree",
    sections: placeholderSections(
      "Twelve dwellings on a constrained urban plot, at least half family-sized.",
      "An infill plot behind a street of terraced houses.",
      "The courtyard is the shared front garden; every door opens to it.",
      "I'd test the corner units again; two of them have long corridors.",
    ),
  },
  {
    slug: "ridge-pavilion",
    no: 4,
    title: "Ridge Pavilion",
    kind: "model",
    year: 2024,
    context: "Model making elective",
    medium: "chipboard + card, 1:50",
    summary: "A stepped pavilion model that follows the contours of a hillside.",
    note: "the roofs step so the hill doesn't have to",
    sections: [
      { heading: "What it tests", body: "How a series of flat roofs can step down a slope without retaining walls." },
      { heading: "How it was made", body: "Laser-cut chipboard contours, hand-cut card roofs, dried-flower trees." },
      { heading: "What I learned", body: "Contour models need a much thicker base than you think." },
    ],
  },
  {
    slug: "stair-study",
    no: 5,
    title: "Stair Study",
    kind: "model",
    year: 2023,
    context: "Studio I",
    medium: "basswood, 1:20",
    summary: "A basswood model of a stair turning through a double-height void.",
    note: "the landing is the room",
    sections: [
      { heading: "What it tests", body: "Whether a stair landing can be generous enough to be a place to stop." },
      { heading: "How it was made", body: "Basswood strips, glued by hand, one scale figure." },
      { heading: "What I learned", body: "Light from above changes how the treads read completely." },
    ],
  },
  {
    slug: "timber-joints",
    no: 6,
    title: "Timber Joint Studies",
    kind: "model",
    year: 2023,
    context: "Construction I",
    medium: "pine, 1:1",
    summary: "Three hand-cut timber joints, made to understand how a frame meets itself.",
    note: "no glue: each joint holds itself",
    sections: [
      { heading: "What it tests", body: "Mortise and tenon, a lapped corner, and a three-way node." },
      { heading: "How it was made", body: "Hand saw and chisel in the workshop, no glue." },
      { heading: "What I learned", body: "Drawing a joint and cutting one are different kinds of knowing." },
    ],
  },
  {
    slug: "civita-sketches",
    no: 7,
    title: "Field Sketches, Central Italy",
    kind: "sketch",
    year: 2024,
    context: "Summer travel",
    location: "Central Italy (placeholder)",
    medium: "pencil + watercolour",
    summary: "A sketchbook kept on a summer walking trip through hill towns.",
    note: "drawn standing up, 20 min each",
    sections: [
      { heading: "Where", body: "Hill towns, drawn on foot over two weeks." },
      { heading: "Why", body: "To understand how towns hold onto steep ground." },
    ],
  },
  {
    slug: "market-hall",
    no: 8,
    title: "Market Hall Reuse",
    kind: "studio",
    year: 2023,
    context: "Studio I",
    location: "Old market district (placeholder)",
    medium: "long section, 1:100",
    summary: "A brick market hall kept and opened up, with a new mezzanine slipped under the trusses.",
    note: "keep the trusses. always.",
    sections: placeholderSections(
      "Adapt a disused market hall for a mix of market stalls and community workshops.",
      "A listed brick hall with timber roof trusses, closed since the 1990s.",
      "Keep the hall whole; insert a light steel mezzanine that never touches the old walls.",
      "The section was the drawing that convinced the crit; the plans less so.",
    ),
  },
  {
    slug: "on-thresholds",
    no: 9,
    title: "On Thresholds",
    kind: "writing",
    year: 2024,
    context: "History & Theory II",
    medium: "essay, 4,000 words",
    summary: "An essay on doorways, porches and the edges of public life.",
    note: "a door is a promise about the room behind it",
    sections: [
      { heading: "Abstract", body: "The threshold read three ways: as a spatial condition, as a lived experience, and as a tool for design." },
      { heading: "Argument", body: "Thresholds are where buildings are most generous or most hostile; the essay reads five precedents." },
      { heading: "Excerpt", body: "“A door is a promise about what kind of room waits behind it.”" },
    ],
  },
  {
    slug: "reading-section",
    no: 10,
    title: "Reading the Section",
    kind: "writing",
    year: 2025,
    context: "Research seminar",
    medium: "paper, 6,000 words",
    summary: "A short research paper on how section drawings teach us to see buildings.",
    note: "the only drawing with sky and ground in it",
    sections: [
      { heading: "Abstract", body: "The section drawing as a way of thinking, not only a way of showing." },
      { heading: "Method", body: "Close readings of section drawings from five buildings." },
      { heading: "Excerpt", body: "“The section is the only drawing that shows the sky and the ground together.”" },
    ],
  },
  {
    slug: "pavilion-rain",
    no: 11,
    title: "Pavilion for Rain",
    kind: "competition",
    year: 2023,
    context: "Student competition (placeholder)",
    medium: "pencil + wash, 1 A1 board",
    collaborators: "with a classmate (placeholder)",
    summary: "A timber umbrella roof that makes waiting out the rain feel like an event.",
    note: "the rain is the event",
    sections: [
      { heading: "Brief", body: "A small shelter for a public park, under 30 m²." },
      { heading: "Idea", body: "One folded roof on a cluster of thin columns, so the rain becomes the show." },
    ],
  },
  {
    slug: "wetland-observatory",
    no: 12,
    title: "Wetland Observatory",
    kind: "competition",
    year: 2025,
    context: "Ideas competition (placeholder)",
    medium: "exploded axonometric",
    summary: "A bird hide on stilts, built from a kit of small timber parts.",
    note: "every part carried in by hand",
    sections: [
      { heading: "Brief", body: "A bird observatory for a protected wetland, buildable without machinery." },
      { heading: "Idea", body: "A kit of short timber members that two people can carry along the boardwalk." },
    ],
  },
]

export const getWork = (slug: string) => works.find((w) => w.slug === slug)

export const neighbours = (slug: string) => {
  const i = works.findIndex((w) => w.slug === slug)
  return {
    prev: works[(i - 1 + works.length) % works.length]!,
    next: works[(i + 1) % works.length]!,
  }
}

// About + contact. Placeholders until Giannia supplies the real details.
export const about = {
  name: "Giannia",
  surname: "",
  role: "Architecture student",
  school: "School of Architecture (placeholder)",
  years: "2022–2026",
  bio: [
    "I'm an architecture student interested in the edges of buildings: thresholds, porches and the places where public life spills inside.",
    "I draw by hand first, build models to check, and write to work out what I think.",
  ],
  email: "hello@example.com",
  cv: "#",
  links: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
}
