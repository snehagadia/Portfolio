# Profile page audit

Review of the personal profile webpage in this folder (`index.html`, `style.css`, `script.js`).

## What the page includes

- A document title in the `<title>` tag and one main heading (`h1`).
- An **About** section with placeholder biography copy.
- A **Skills** section rendered as a list.
- A **Projects** section with linked titles and short descriptions.
- Styles kept in `style.css` (no inline `style` attributes).
- Light JavaScript in `script.js` for the footer year, mobile menu, and active nav highlighting.

## Structure and accessibility

- The page uses a skip link, a header landmark, a main landmark, and a footer.
- Section headings (`h2`) label About, Skills, and Projects.
- Navigation has an accessible name (`aria-label="Primary"`).
- The menu button exposes `aria-expanded` and `aria-controls`.
- Project links use `rel="noopener noreferrer"` because they open in a new tab.
- Focus styles are defined for links and buttons.
- Color contrast is intended to stay readable on the cream background; after you replace PLACEHOLDER copy, re-check contrast if you change the palette.

## Placeholders to replace

Search the project for the word `PLACEHOLDER`. At audit time, placeholders include:

- Full name and first name (title, heading, wordmark, footer)
- Headline, city, about paragraphs, and email
- Six skill names
- Three project titles, descriptions, and URLs (`https://PLACEHOLDER.example.com/...`)

Do not ship the page publicly until those strings are replaced with real details.

## JavaScript behavior

- Sets the copyright year from the system date.
- Toggles the header menu on small screens and closes it after a nav click.
- Marks the current section in the nav while scrolling (where `IntersectionObserver` is available).

If JavaScript is disabled, the page still renders and all section links still work.

## Suggested next checks after you fill in details

1. Replace every `PLACEHOLDER` string, then search again to confirm none remain.
2. Point project links at real URLs (or local pages) and confirm they open correctly.
3. Open `index.html` in a browser, resize below 700px, and try the Menu button.
4. Tab through the page with the keyboard and confirm focus is visible.
5. Add a real favicon, photo, or contact method if you want those later — they are not in this first version.
