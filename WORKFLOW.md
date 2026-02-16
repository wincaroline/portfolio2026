# Adding a new case study

Use this workflow to create new case study pages from the shared components.

## 1. Copy the page shell

Copy the full contents of `components/case-study-shell.html` into a new file, e.g. `belkin-case-study.html`.

## 2. Update the page title

In the `<head>`, change the `<title>` to your project: `Client – Project Title`.

## 3. Fill in the hero

Use `components/case-hero.html` as reference. Edit the placeholder content:

- **Eyebrow**: `Company · Client Name` (e.g. `Belkin · Belkin International, Inc.`)
- **Title**: Project name
- **Subtitle**: Brief summary of the project
- **Meta**: Role, Timeline, Team
- **Image**: Update `src` and `alt` for your screenshot

## 4. Add sections

Paste the **Jump To** nav and **case-block** sections. Use `disney-case-study.html` as reference: add `case-jump-nav`, then sections with `case-block`, `case-block__title`, `case-block__lead`, `case-block__content`, and optional `case-block__media` / `case-block__caption`. Documented in `patterns.html` under “Case study sections”.

## 5. Link from the index

Add a link to your new case study from the relevant case card on `index.html` (update the `href` on the "Learn More" button).

## Reference

- **Pattern library** (`patterns.html`): Visual reference and copyable HTML for all components
- **Style guide** (`style-guide.html`): Typography, colors, buttons, cards
- **Source files** (`components/`): Canonical markup—edit these when a pattern changes site-wide
