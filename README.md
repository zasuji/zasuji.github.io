# Tong Zhang's Academic Homepage

Personal research website for Tong Zhang, a Ph.D. student in Software Engineering at Zhejiang University. The site includes publications, patents, education, experience, and contact information. The intended GitHub Pages address is [zasuji.github.io](https://zasuji.github.io/); local changes appear there only after deployment.

The site uses custom CSS and native JavaScript without a build step or package installation. Markdown and YAML are parsed in the browser using bundled Marked and js-yaml. Fonts use system fallbacks, and the page does not request external fonts or icon libraries.

## Local Preview

From the repository root, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`, then refresh after editing files. HTTP previews load the latest Markdown and YAML directly.

You can also double-click `index.html`. Local file previews use `static/js/content-bundle.js`, a bundled copy of the content that avoids browser restrictions on fetching local files. After editing anything in `contents/`, synchronize this copy:

```sh
node scripts/sync-content.js
```

Commit the generated bundle with its source changes. The same snapshot keeps sections readable if an HTTP content request fails; the browser console records that fallback.

## Editing Content and Design

| Location | Purpose |
| --- | --- |
| `contents/home.md` | Biography and research introduction |
| `contents/publications.md`, `contents/patents.md` | Research entries, publication status, and links |
| `contents/education.md`, `contents/work-experience.md` | Education and employment timelines |
| `contents/skills.md`, `contents/awards.md`, `contents/hobby.md` | Supporting personal information |
| `contents/config.yml` | Browser title, site name, About heading, and copyright text |
| `index.html` | Page layout, hero, contact links, metadata, and section containers |
| `static/css/main.css` | Responsive design, animation, reduced-motion and print styles |
| `static/js/scripts.js` | Content loading, mobile navigation, MathJax, and BibTeX copying |
| `scripts/sync-content.js` | Generate/check the local content snapshot; do not hand-edit `static/js/content-bundle.js` |
| `static/assets/` | Favicon, portrait, and decorative research artwork |
| `document/` | Local PDFs linked from research entries |

Content files support Markdown and trusted HTML. Preserve the existing article classes when editing publication, patent, or timeline entries. For a new section, add its filename to `section_names` in `scripts.js` and create the matching `<name>-md` container and section anchor in `index.html`.

The FatigueFormer BibTeX string is maintained in `scripts.js`; update it alongside the corresponding publication entry. Verify author order, titles, links, and publication status against primary sources. Label preprints and manuscripts explicitly.

## Mathematics and Dependencies

MathJax 3.2.2 loads once from `static/js/tex-svg.js`, after which the application typesets the loaded sections. Standard delimiters include `$...$`, `\(...\)`, `$$...$$`, and `\[...\]`. Optional TeX extensions load from the pinned MathJax 3.2.2 release on jsDelivr and require internet access.

Keep Markdown emphasis outside formulas containing `*`; use TeX formatting inside equations to avoid ambiguity with the Markdown parser.

Legacy Bootstrap scripts, theme CSS, and the old background image remain in the repository but are not loaded by the current design. Do not hand-edit bundled third-party libraries.

## Verification

```sh
node --check static/js/scripts.js
node scripts/sync-content.js --check
git diff --check
git diff --stat
```

There is no automated test suite or coverage threshold. Preview desktop and mobile layouts; check all eight content sections, navigation, mobile-menu closing, the research overview disclosure, BibTeX copying, images, PDF links, and equations. Check keyboard focus, reduced-motion behavior, and browser-console/network errors. A missing section or math dependency must not hide otherwise available content.

## GitHub Pages Deployment

For branch-based publishing, configure the repository's **Settings → Pages → Build and deployment** to use **Deploy from a branch**, with the intended branch (normally `main`) and **/(root)**. After reviewing and committing changes, push to that publishing branch, then check the Pages deployment result before treating the live site as updated. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## License and Attribution

The repository originated from Sen Li's academic homepage template. Preserve the original copyright notice and MIT license in [LICENSE](LICENSE).
