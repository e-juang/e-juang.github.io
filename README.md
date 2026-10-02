# Portfolio Site

Plain HTML/CSS/JS, no build step. Open `index.html` in a browser or
right-click → "Open with Live Server" in VSCode. The portfolio is a
single scrolling page; the header tabs jump to its sections.

## Structure

```
index.html             Complete one-page portfolio
experience.html         Legacy standalone page (not used by navigation)
projects.html            Legacy standalone page (not used by navigation)
hobbies.html               Legacy standalone page (not used by navigation)
resume.html                  Legacy standalone page (not used by navigation)
css/style.css                 All styling, one shared file
js/site.config.js                Your name, contact links, and nav/page list
js/components.js                    <site-header> / <site-footer> — see below
assets/                                Put your images and resume.pdf here
```

## The header and footer are now shared components

Every page includes:

```html
<site-header></site-header>
...
<site-footer></site-footer>
```

These are defined once in `js/components.js` and pull their content
(your name, nav links, email, LinkedIn/GitHub, "Sheet X of N") from
`js/site.config.js`. **You never need to hand-edit the header or
footer markup in an individual page again.**

## To customize

1. **Name / contact / nav links**: edit `js/site.config.js`. This one
   file controls the brand name in the header, every footer's contact
   block, and the nav bar's page list/order on all five pages.
2. **Body text**: every `[bracketed placeholder]` and generic sentence
   should be replaced with your real content — search each file for
   `[` to find them fast.
3. **Resume**: drop your resume as `assets/resume.pdf` (exact filename).
4. **Project photos**: add images to `assets/` and update the `src` in
   each `.reg-card img` on `projects.html`. Keep them roughly the same
   aspect ratio (the CSS crops to 180px tall) for a clean grid.
5. **Colors/fonts**: everything is driven by the CSS variables at the
   top of `css/style.css` (`:root { ... }`) — change a value there and
   it updates site-wide.
6. **Adding a project or timeline entry**: duplicate one `.reg-card`
   block (projects/hobbies) or one `.timeline-item` block (experience)
   and edit.
7. **Adding/removing/reordering a whole page**: edit the `pages` array
   in `js/site.config.js` — the nav bar and the footer's "Sheet X of N"
   count update automatically. Don't forget to also create or delete
   the actual `.html` file.

## Recommended: VSCode Live Server extension

Install the "Live Server" extension, then right-click `index.html` →
"Open with Live Server" to preview with auto-reload as you edit.

## Deploying (free)

**GitHub Pages** — push this folder to a GitHub repo, then in the repo
Settings → Pages, set the source to your main branch. Your site will be
live at `https://yourusername.github.io/repo-name`.

**Netlify / Vercel** — drag-and-drop the folder onto their dashboard, or
connect the GitHub repo for auto-deploys on every push.
