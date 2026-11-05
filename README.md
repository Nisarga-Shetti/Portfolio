# NEXUS - Nisarga Shetti Portfolio

A scroll-driven 3D portfolio. As you scroll, the camera flies through a space station, a holographic Earth, a solar system and a spiral galaxy, while the content sits in glass panels on the left (desktop) or in a single column (mobile).

## Stack

- Vite, React 18, TypeScript, Tailwind CSS
- three.js for the 3D universe (used directly, no wrapper library)
- Supabase for the contact form only
- lucide-react for icons

## Running locally

```bash
npm install
npm run dev        # development server
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run build      # production build
```

Environment variables go in `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Editing content

All text, links and project data live in `src/data/`:

- `src/data/portfolio.ts` - name, role, intro, about text and stats, navigation items, education, certifications, projects, social links, HUD location labels and loader lines.
- `src/data/tech.ts` - skill categories and the skills within them.

Projects with a `live` URL automatically get a Live button. Without one, only the Code button appears.

The resume PDF is served from `public/Nisarga_Shetti_Resume.pdf`. Replace that file to update the download.

## Colors and theme

- Color tokens are CSS variables at the top of `src/index.css` (`--void`, `--deep-navy`, `--cyan`, `--electric-purple`, `--lavender`, `--magenta`, `--text`, `--muted`).
- Tailwind uses the same palette, defined in `tailwind.config.js`. If you change a color, update both places.
- Glass panels, the scanline overlay and the button and keycap styles are also in `src/index.css`.

## Sections and navigation

Section order is set in one place per concern:

- The page order is in `src/App.tsx` (`SECTION_IDS` and the `<section>` elements).
- The navigation menu order comes from `navItems` in `src/data/portfolio.ts`.
- Camera stops follow the same order (see below).

## The camera journey

The 3D scene lives in `src/components/universe/`:

- `UniverseCanvas.tsx` - renderer, camera, lighting, scroll sync, pointer parallax, FOV warp, and fallback.
- `cameraJourney.ts` - the camera stop for each section. `home`, `about`, `skills`, `education`, `projects`, `certifications`, `resume`, and `contact` each map to a position and look-at point. Some stops follow live planet positions (for example, Saturn for Skills, Mars for Education). Positions are offsets from the body they track, so edit the vectors to change framing.
- `solarSystem.ts`, `galaxies.ts`, `globe.ts`, `station.ts`, `nebulae.ts`, `starField.ts` - the scene objects. Star counts and galaxy detail are reduced automatically on mobile.

Between sections, the camera eases smoothly from one stop to the next as you scroll. If you add a section, add a matching camera stop in `cameraJourney.ts`.

## Accessibility and performance

- Reduced motion: when the operating system asks for less motion, the camera jumps between stops, the cursor and scramble effects turn off, and the loader finishes quickly.
- Touch devices get no custom cursor and a lighter scene.
- Rendering pixel density is capped at 1.5, and rendering pauses when the browser tab is hidden.
- If WebGL is unavailable, the page shows a gradient background instead of the 3D scene, and all content still works.
- Keyboard users can move between sections with the left and right arrow keys.

## Contact form

Submissions are saved to a Supabase table named `contact_messages`. Row-level security allows inserts only, so visitors can send messages but cannot read anyone else's.
