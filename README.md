# Muhammad Adnan's Portfolio

A static portfolio site. No build step, no framework, no dependencies to install.
Open the files, edit, push. GitHub Pages serves it as is.

**Live:** https://adnan-zy.github.io/Portfolio/

---

## Adding or editing a project

All projects live in one file: `assets/data/projects.json`.
You do not edit that file by hand. Use the dashboard.

### 1. Start a local server

The dashboard reads `projects.json` over HTTP, so opening `admin.html` by
double-clicking will not work. From the project folder run either of these:

```bash
npx serve .          # if you have Node installed
python -m http.server # if you have Python installed
```

Then open <http://localhost:8000/admin.html> (or whichever port it prints).

### 2. Add the project

Click **New**, then fill in:

| Field | What goes in it |
| --- | --- |
| Title | The project name |
| Short description | One line. This is what shows on the card in the grid. |
| Full description | Written for the client. What problem they had, what you built, what is better now. Blank lines make paragraphs. |
| What you did | Your part, e.g. "Design and development" |
| Status | Live, in progress, archived or private |
| Live URL | The running site, if there is one |
| Repository URL | The repo, if it is public |
| Screenshots | Drag image files in, or type paths manually |
| Highlights | One bullet per line, optional |
| Featured | The first featured project spans two columns in the grid |

Reorder projects with the arrows in the left list. The order in the list is the
order on the site.

### 3. Handle the screenshots

The browser cannot write files to disk. When you drop images into the
dashboard it records the path `assets/images/<filename>` and shows you a
reminder listing which files you still need to copy.

**Copy those image files into `assets/images/` yourself before committing.**

### 4. Save

Click **Download projects.json**, then replace `assets/data/projects.json` with
the downloaded file and commit:

```bash
git add assets/data/projects.json assets/images/
git commit -m "Add <project name>"
git push
```

Your work in the dashboard is autosaved to the browser, so closing the tab by
accident does not lose anything. **Reload** pulls the committed version back in
and discards the draft.

---

## Layout

```
index.html              The site
admin.html              The project dashboard (not indexed, not linked from the site)
assets/
  data/projects.json    Every project. Single source of truth.
  css/main.css          Site styles and design tokens
  css/admin.css         Dashboard styles
  js/main.js            Renders the project grid and the detail view
  js/admin.js           The dashboard
  images/               Project screenshots
  cv.pdf                Resume, linked from the hero
```

## Editing everything else

Text outside the projects section (hero, experience, skills, about, contact)
is written directly in `index.html`. Colours, spacing and type sizes are all
CSS variables at the top of `assets/css/main.css`, under `:root` for light mode
and `html[data-theme="dark"]` for dark mode.

## Notes

- Individual projects are linkable: `index.html#project-farm-to-home` opens
  that project directly.
- Icons are inline SVG and fonts come from Google Fonts. Nothing else is
  loaded from a CDN.
- The theme follows the visitor's system setting until they toggle it, after
  which their choice is remembered.

## Connect

- GitHub: [Adnan-ZY](https://github.com/Adnan-ZY)
- LinkedIn: [Muhammad Adnan](https://www.linkedin.com/in/muhammad-adnan-767776332)
- Email: madnanhz42@gmail.com
