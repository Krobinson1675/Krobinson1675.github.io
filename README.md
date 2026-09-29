# kali-robinson-site

Static site — no build step. Open `index.html` in a browser to preview locally.

```
index.html      page content (edit text here)
css/styles.css  theme; colors/blur/fonts are tokens at the top in :root
js/main.js      typed roles, skill highlighting, project tabs, network background
```

## Adding things later
- New job: copy an `<li class="role ...">` block in the Experience timeline. List skill keys in `data-skills` so the Expertise chips can highlight it.
- New project: copy an `<article class="project ...">`; set `data-cat` to infra | auto | sec (or add a new tab).
- New skill chip: add `<button class="chip" data-skill="yourkey">` and use `yourkey` in any `data-skills` attribute.
- New cert: copy a `.cred` card. Move AZ-800 out of "in progress" when you pass.
- New section: copy a `<section class="section reveal">` and add a nav link to its id.

## Deploy (Cloudflare Pages)
1. Push this folder to a GitHub repo (or use "Upload assets" in the Cloudflare dashboard).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo. Build command: none. Output directory: `/`.
3. Custom domains → add your domain. If the domain is registered in Cloudflare, DNS is configured automatically.
4. Every push to `main` redeploys.
