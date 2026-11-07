# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Architecture practices reviewing Giannia for internships and junior roles: they skim many portfolios quickly and need to see range, drawing skill, and thinking within a minute.
- Graduate admissions committees (M.Arch and similar): they read more slowly and look for process, research, and a clear design voice.
- Anyone she shares it with personally: friends, peers, tutors.

## Product Purpose

A personal portfolio for Giannia, an architecture student. It presents her body of work as a catalog: every work is a sticker on the main page, and opening a sticker shows details and notes. Success: a reviewer finds the strongest projects fast, opens one, and leaves knowing how she thinks and draws, and finds how to contact her.

## Positioning

A portfolio kept like her own notebook or diary: the work is collected as stickers rather than laid out as a grid of thumbnails or a PDF. The format should feel personal and cute while still reading as serious, professional architectural work.

## Operating Context

- Entries span studio projects (drawings, renders, models), sketches and physical models, writing (essays, research), and competitions or other work (workshops, photography).
- Reviewers open it from an email, application form, or CV link, mostly on desktop, sometimes on a phone.
- Each entry has a detail view with images, details (year, course or studio, type, location, collaborators where relevant), and her notes.

## Capabilities and Constraints

- Existing Next.js 16 (app router), Tailwind v4, shadcn/base-ui, framer-motion codebase.
- Main page: sticker catalog with filtering by entry properties (inherited from the existing skeleton). Clicking a sticker opens that entry's detail page.
- Short About + contact (bio, email, CV download).
- Open: the real works list, images, and texts. Giannia's surname, school, and links are not yet provided.

## Brand Commitments

- "Cute but professional", "creative but professional" (from the user).
- Governing metaphor from the user: a diary or notebook holding a sticker catalog of her projects and writing.

## Evidence on Hand

None yet. All works, images, and copy are placeholders until the real list arrives; mock entries must be labelled as placeholders and never presented as real projects, awards, or schools.

## Product Principles

1. The work leads; the notebook frames it and never upstages a drawing.
2. Charm in the details, professional in the structure: a reviewer can always scan, filter, and find contact in seconds.
3. Every entry earns a sticker, and every sticker opens into substance: notes, process, facts.
4. Easy for the user to swap in real content later: data-driven entries, no hand-placed one-offs.
