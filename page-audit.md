# Portfolio Content Audit

Review of the personal portfolio for Sneha Gadia (`index.html`, `style.css`, `script.js`).

| Content on the Page | True? | Evidence, or What I Removed |
| --- | --- | --- |
| My name | Yes | The name **Sneha Gadia** appears in the page title, logo, main `h1`, contact card, and footer. Initials avatar uses **SG**. No photograph was invented. |
| About section | Yes | The About section uses the supplied student introduction, rewritten as two natural paragraphs. It does not claim professional job experience. |
| Skills | Yes | Skills are grouped as Programming, Web Development, Tools and Technologies, Design and Project Tools, and Professional Skills. They are labelled as learning/developing. No proficiency percentages or certifications were added. Git and GitHub are listed as learning only. |
| Education | Yes | B.Tech, Computer Science and Engineering, JECRC University, Jaipur, Rajasthan, India, second year. CGPA, school name, marks, and expected graduation year were not invented. |
| GitHub repository | No | Contact shows `PLACEHOLDER_GITHUB_URL` as highlighted text, not as a working link. |
| LinkedIn profile | No | Contact shows `PLACEHOLDER_LINKEDIN_URL` as highlighted text, not as a working link. |
| Email address | No | Contact shows `PLACEHOLDER_EMAIL` as highlighted text, not as a `mailto:` link. |
| Project descriptions | Yes, with limits | Four project cards use only the given facts: this portfolio (current), line-following robot (MakerXBotCamp / JECRC / Makerspace), basic Tinkercad 3D design, and the campus navigation **concept**. No hardware specs, model names, or launch claims were added. SIH is listed under achievements, not as a shipped project. Project public links (except this site) are `PLACEHOLDER` text, not URLs. |
| Achievements | Yes, with limits | Included: 15% academic scholarship as previously reported; SIH participation (not a win or round); MakerXBotCamp; robotics and Tinkercad learning; university activities, volunteering, and collaborative projects. No dates, rankings, certificates, or extra awards were invented. |

## Placeholders to replace

Search the folder for `PLACEHOLDER`. You still need to add:

- `PLACEHOLDER_EMAIL`
- `PLACEHOLDER_GITHUB_URL`
- `PLACEHOLDER_LINKEDIN_URL`
- Optional project public links marked `PLACEHOLDER` on the robot, 3D design, and campus concept cards

These placeholders are dashed gold highlights on the page so they are easy to find. They are not clickable profile or email links.

## What still needs your review

- Confirm the 15% scholarship wording matches how you want it described.
- Confirm MakerXBotCamp, Makerspace, and SIH participation wording.
- Add real contact URLs and email when you are ready to share the site.
- Optional: a real photograph later, if you want to replace the SG avatar.

## Technical notes

- `index.html` links to `style.css` and `script.js` with relative paths.
- There are no inline `style` attributes.
- Dark-mode colours live on `body.dark-mode`; this task does not add a toggle button.
- JavaScript logs `JavaScript connected`, sets the footer year, and handles the mobile menu. It checks that elements exist before using them.
