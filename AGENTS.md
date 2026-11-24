# Repository Guidelines

## Project Structure & Module Organization

This is a buildless academic homepage for GitHub Pages. `index.html` defines the layout, hero, contact links, and metadata. `static/js/scripts.js` loads eight content sections: home, publications, patents, education, work experience, skills, awards, and hobbies.

- `contents/*.md`: Markdown and trusted HTML for those sections.
- `contents/config.yml`: title, site name, About heading, and copyright; keys match HTML IDs.
- `static/css/main.css`: custom responsive, motion, and print styles.
- `static/js/`: application code and bundled Marked, js-yaml, and MathJax.
- `static/assets/`: portrait, favicon, and research artwork; `document/`: downloadable PDFs.

Legacy Bootstrap files remain unused. When adding a section, align its filename, `section_names` entry, section anchor, and `<name>-md` container.

## Build, Test, and Development Commands

Run from the repository root:

- `python -m http.server 8000 --bind 127.0.0.1`: preview at `http://127.0.0.1:8000`.
- `node --check static/js/scripts.js`: validate JavaScript syntax.
- `node scripts/sync-content.js`: synchronize the local content snapshot after editing `contents/`; commit the generated bundle too.
- `node scripts/sync-content.js --check`: detect a stale snapshot without writing files.
- `git diff --check`: check whitespace errors.
- `git diff --stat`: review changed files.

No compilation or package installation is required. HTTP reads current content; `file://` uses generated `static/js/content-bundle.js`. Failed HTTP content requests also fall back to this snapshot. Fonts and MathJax's core are local; optional TeX extensions use jsDelivr's pinned 3.2.2 release.

## Coding Style & Naming Conventions

Use four-space indentation in HTML and JavaScript; match surrounding CSS formatting. Use lowercase, hyphenated section names such as `work-experience`. Preserve UTF-8, semantic article classes, accessible labels, and LaTeX delimiters. Keep authored styles in `main.css`; do not hand-edit bundled libraries. No formatter or linter is configured.

## Testing Guidelines

There is no automated suite or coverage threshold. Check desktop and narrow mobile layouts, all eight loaded sections, keyboard navigation, menu closing, research disclosures, citation copying, image/PDF links, and equations. Inspect console/network errors. Verify reduced-motion behavior and that a failed section or math renderer leaves other content usable.

## Content, Commit & Pull Request Guidelines

Verify scholarly metadata against primary sources; distinguish preprints, under-review manuscripts, and published work. Update FatigueFormer's BibTeX in `scripts.js` alongside its publication entry.

History mainly uses `Update <filename>` subjects. Prefer concise, descriptive commits. PRs should explain changes, list checks, link relevant issues, and include desktop/mobile screenshots for layout changes. Local edits are not deployed until pushed to the configured Pages source.
