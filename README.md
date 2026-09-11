# Gabriel Parra — Portfolio

Live at **[gabrielparra.dev](https://gabrielparra.dev)**

Personal portfolio for Gabriel Parra — full-stack engineer, Business Analyst II at UCF Global, founder of BananaByte LLC. Calm, recruiter-practical single page: who I am, what I've shipped, how to reach me.

## Sections

- **Hero** — positioning and open-to-work CTA
- **Work** — outcome-first project rows (screenshots when available)
- **About / Experience** — bio, education, service record
- **Working with me** — short collaboration pillars
- **Skills** — numbered capability rows
- **Contact** — EmailJS form plus mailto / GitHub / LinkedIn / BananaByte

Arcade minigames remain in the repo and can still be opened via Konami code; they are not part of the primary navigation.

## Stack

React 19 + Vite 7, vanilla CSS (Hanken Grotesk, olive/cream/violet tokens), EmailJS for the contact form. Optional Vercel serverless function (`api/github-repos.js`) for a GitHub proxy if re-enabled later.

## Setup

```bash
npm install
npm run dev
```

```bash
npm run build   # production build
npm run lint     # ESLint
```

Requires the `VITE_EMAILJS_*` keys as environment variables in production (see Vercel project settings). `GITHUB_TOKEN` is only needed if the GitHub feed API is used.
