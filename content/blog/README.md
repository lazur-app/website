# Publishing a Lazur blog post

Each post is one markdown file. That file becomes one URL (`/blog/your-slug`), which is what Google and answer engines rank.

Do **not** add posts through an admin panel. Copy the template, fill it in, deploy.

## Ship a post

1. Copy `_template.md` to `your-slug.md` in this folder.
2. The filename **is** the URL: `how-to-dictate-on-mac.md` → `lazur.app/blog/how-to-dictate-on-mac`.
3. Fill frontmatter (title, description, keyword, TL;DR, FAQ).
4. Write the body in markdown. Follow the heading wireframe in the template.
5. Run the site (`npm run dev` in `website/`) and check `/blog/your-slug`.
6. Commit and deploy. Sitemap and JSON-LD pick the post up automatically.

Skip files that start with `_`, they are not published.

## SEO / GEO rules

- **One primary keyword per URL.** Do not write a second post that targets the same query.
- **Description:** 150–160 characters, includes the keyword, reads like an answer.
- **First paragraph:** answer the query in two sentences. Answer engines quote this.
- **TL;DR:** 3–4 bullets a model can lift verbatim.
- **FAQ:** 3–5 real questions. These become FAQ schema.
- **Internal links:** at least two, other posts, `/compare/*`, `/pricing`, or `/download`.
- **How-to posts:** fill the `howto` steps in frontmatter for HowTo schema.
- **Comparisons:** use `/compare/lazur-vs-*` for head-to-heads. Use `/blog/` for guides, lists, and how-tos.

## After you publish

- Confirm the post appears on `/blog`.
- Confirm `/sitemap.xml` includes the new URL.
- Share the canonical `https://www.lazur.app/blog/your-slug`, not localhost, not a duplicate path.
