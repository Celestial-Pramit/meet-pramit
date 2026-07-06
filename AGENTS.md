# Portfolio — Pramit Datta

## Stack
HTML + CSS + vanilla JS. No frameworks. Google Font: Inter. Icons: Lucide (CDN), Devicon (CDN). PDF.js (CDN).

## Color Scheme
Dark coral/rose. `--accent-primary: #ff6f61; --accent-secondary: #f43f5e;`

## Structure
- 7 sections: Hero, About, Skills, Education, Projects, Resume, Contact + Footer
- Sticky navbar (transparent→solid+blur on scroll, hamburger <768px)
- Snow particles (canvas, count scales with area)
- Custom cursor removed (user wants normal cursor)
- Theme toggle (moon/sun, localStorage persisted, light overrides via `body.light`)
- Konami code (↑↑↓↓←→←→BA → 4s hue-rotate rainbow)
- Hero scramble animation (IntersectionObserver, height-locked during animation)
- Timeline vertical line (scroll-progress gradient fill via JS)
- PDF.js resume viewer (canvas + prev/next controls + toggle)
- Contact form (Formspree `https://formspree.io/f/xnjkwlgk`, fallback mailto)
- Floating Pikachu (CSS art, draggable, random float every 3s, grab cursor)
- Circle menu (right side, settings button → brightness/theme/translate options)

## Responsive
- Hamburger menu <768px
- Custom cursor hidden on touch devices (`@media (hover: hover) and (pointer: fine)`)
- Various grid→single-column breakpoints at 768px/500px

## Live
- GitHub Pages: https://celestial-pramit.github.io/meet-pramit/
- Repo: https://github.com/Celestial-Pramit/meet-pramit.git
- Branch: master (auto-deploys to GH Pages on push)

## Files
- `index.html` — full page
- `style.css` — all styles (1957 lines)
- `script.js` — all JS (527 lines)
- `resume.pdf`, `pramit.png`, `pramit 2.jpg` — assets
- `project-*.jpg` — 5 Unsplash images for project cards

## User Preferences
- No custom cursor (normal cursor)
- Pikachu draggable (grab cursor, click+hold to drag)
- Circle menu with brightness/theme/translate actions

## Notes
- Run local: `python -m http.server 3000`
- Push: `git add -A && git commit -m "msg" && git push`
