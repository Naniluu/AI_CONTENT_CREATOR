# CREOVATE — AI Content Creator Marketplace

CREOVATE is a local hackathon prototype for discovering AI-native creative talent and turning brand ideas into structured production briefs. It focuses on AI creator portfolios, searchable skills and tools, commercial-use requirements, and a clear discovery-to-delivery demo flow.

## Run locally

Install Node.js, then run `npm run dev` from this folder and open http://localhost:3000.

To prepare a static deployment, run `npm run build`. The host-ready site files are copied to `dist/`.

## Publish with GitHub Pages

1. Create an empty public GitHub repository named `creovate`.
2. In the repository, open Settings → Pages and set the source to GitHub Actions.
3. Push this project to the repository's `main` branch. The workflow in `.github/workflows/pages.yml` builds and deploys the site after each push.

The project URL will be `https://YOUR-GITHUB-USERNAME.github.io/creovate/`. GitHub Pages sites are public, so only publish demo-safe data and files.

## Prototype features

- Creator cards include specialties, skills, AI tools, content types, output formats, rates, and sample portfolio work.
- Search and filters cover tools, specialties, and content type. The result count and resettable empty state make discovery outcomes clear.
- Portfolio details show generation and workflow information alongside explicit sample-data trust labels.
- The brief studio collects content type, visual style, aspect ratio, delivery format, budget, timeline, and requested commercial-use scope.
- A local rule-based preview suggests production details and splits a demo budget into milestones. It is not connected to an AI service or payment provider.
- The engagement view illustrates feedback and delivery stages for a marketplace workflow.

## Demo data and prototype boundaries

Creator profiles, portfolio entries, brands, and briefs are sample records. Tool claims are creator-reported demo data, workflow records are illustrative, and past work is sample work; none of these are independently verified. Brief previews and milestone allocations are simulated. The prototype does not generate media, process payments, hold escrow, or grant or transfer intellectual-property rights. A requested commercial-use scope is a brief requirement, not a license; final usage terms need a separate agreement.

See [HACKATHON_DEMO.md](HACKATHON_DEMO.md) for a short walkthrough, rubric map, and data-model note.
