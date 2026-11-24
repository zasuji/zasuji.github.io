const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'publications', 'patents', 'education', 'work-experience', 'skills', 'awards', 'hobby'];
const fatigueformer_citation = `@misc{zhang2026fatigueformer,
    title = {{FatigueFormer}: A Physiology-Informed Model for Upper-Limb Muscle Fatigue Assessment},
    author = {Tong Zhang and Hong Guo and Shuangzhou Yan and Dongkai Weng and Jian Wang and Hongxin Zhang},
    year = {2026},
    eprint = {2603.26841},
    archivePrefix = {arXiv},
    primaryClass = {cs.LG},
    url = {https://arxiv.org/abs/2603.26841}
}`;

// Keep TeX out of Markdown's escape/emphasis parsing; MathJax reads it later.
function matchMath(source, displayOnly = false) {
    const display = source.match(/^(?:\$\$(?:\\[\s\S]|[^\\])*?\$\$|\\\[(?:\\[\s\S]|[^\\])*?\\\])/);
    if (display || displayOnly) {
        return display && display[0];
    }
    const parentheses = source.match(/^\\\((?:\\[\s\S]|[^\\])*?\\\)/);
    if (parentheses) {
        return parentheses[0];
    }
    const dollars = source.match(/^\$(?!\s|\$)((?:\\[^\n]|[^\\$\n])+?)\$(?!\d)/);
    return dollars && !/\s$/.test(dollars[1]) ? dollars[0] : null;
}

function escapeMath(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

if (window.marked) {
    marked.use({ extensions: [
        {
            name: 'mathInline',
            level: 'inline',
            start(source) { return source.search(/\$|\\\(|\\\[/); },
            tokenizer(source) {
                const raw = matchMath(source);
                if (raw) {
                    return { type: 'mathInline', raw };
                }
            },
            renderer(token) { return escapeMath(token.raw); }
        },
        {
            name: 'mathBlock',
            level: 'block',
            start(source) { return source.search(/^ {0,3}(?:\$\$|\\\[)/m); },
            tokenizer(source) {
                const indent = source.match(/^ {0,3}/)[0];
                const text = matchMath(source.slice(indent.length), true);
                if (text) {
                    const ending = source.slice(indent.length + text.length).match(/^[ \t]*(?:\n|$)/);
                    if (ending) {
                        return { type: 'mathBlock', raw: indent + text + ending[0], text };
                    }
                }
            },
            renderer(token) { return `<div class="math-block">${escapeMath(token.text)}</div>\n`; }
        }
    ] });
}

async function fetchText(path) {
    const bundledContent = window.HOMEPAGE_CONTENT;
    const hasBundledContent = bundledContent && Object.prototype.hasOwnProperty.call(bundledContent, path);

    // Local files cannot fetch sibling Markdown in browsers. Use the snapshot
    // loaded by a normal script tag instead, without changing browser security.
    if (window.location.protocol === 'file:') {
        if (hasBundledContent) {
            return bundledContent[path];
        }
        throw new Error(`Missing local content snapshot for ${path}. Run node scripts/sync-content.js.`);
    }

    try {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Could not load ${path}: HTTP ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        if (hasBundledContent) {
            console.warn(`Using bundled content for ${path}.`, error);
            return bundledContent[path];
        }
        throw error;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('site-menu');
    if (menuToggle && menu) {
        function setMenuOpen(open) {
            menuToggle.setAttribute('aria-expanded', String(open));
            menu.classList.toggle('is-open', open);
        }

        menuToggle.addEventListener('click', () => {
            setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });
        menu.addEventListener('click', event => {
            if (event.target.closest('a')) {
                setMenuOpen(false);
            }
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });
        window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
            if (event.matches) {
                setMenuOpen(false);
            }
        });
    }

    // Delegation keeps citation controls working after Markdown is inserted.
    document.addEventListener('click', async event => {
        const button = event.target.closest('[data-copy-citation="fatigueformer"]');
        if (!button) {
            return;
        }
        const article = button.closest('article');
        if (!article) {
            return;
        }
        const status = article.querySelector('.citation-status');
        let fallback = article.querySelector('.citation-fallback');
        button.disabled = true;

        try {
            if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
                throw new Error('Clipboard API is unavailable.');
            }
            await navigator.clipboard.writeText(fatigueformer_citation);
            if (fallback) {
                fallback.remove();
            }
            button.textContent = 'Copied';
            if (status) {
                status.textContent = 'BibTeX copied to clipboard.';
            }
            window.setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 2000);
        } catch (error) {
            if (!fallback) {
                fallback = document.createElement('textarea');
                fallback.className = 'citation-fallback';
                fallback.readOnly = true;
                fallback.rows = 10;
                fallback.setAttribute('aria-label', 'FatigueFormer BibTeX citation');
                article.appendChild(fallback);
            }
            fallback.value = fatigueformer_citation;
            fallback.focus();
            fallback.select();
            button.textContent = 'Copy BibTeX';
            if (status) {
                status.textContent = 'Clipboard unavailable. Copy the selected citation below.';
            }
        } finally {
            button.disabled = false;
        }
    });

    const configTask = fetchText(content_dir + config_file)
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.innerHTML = yml[key];
                } else {
                    console.warn('Unknown configuration element:', key);
                }
            });
        })
        .catch(error => console.error('Site configuration could not be loaded.', error));

    const sectionTasks = section_names.map(async name => {
        const element = document.getElementById(name + '-md');
        if (!element) {
            console.warn('Missing section container:', name);
            return null;
        }

        try {
            const markdown = await fetchText(content_dir + name + '.md');
            element.innerHTML = marked.parse(markdown, { mangle: false, headerIds: false });
            element.classList.remove('load-error');
            return element;
        } catch (error) {
            element.textContent = 'This section could not be loaded. Please refresh the page.';
            element.classList.add('load-error');
            console.error(`Section ${name} could not be loaded.`, error);
            return null;
        }
    });

    const sections = (await Promise.all(sectionTasks)).filter(Boolean);
    await configTask;

    // Render math once, after every section has settled and MathJax is ready.
    // A missing or failed math renderer must leave the Markdown content intact.
    const mathJax = window.MathJax;
    if (mathJax && sections.length) {
        try {
            if (mathJax.startup && mathJax.startup.promise) {
                await mathJax.startup.promise;
            }
            if (typeof mathJax.typesetPromise === 'function') {
                await mathJax.typesetPromise(sections);
            }
        } catch (error) {
            console.warn('Math could not be rendered.', error);
        }
    }
});
