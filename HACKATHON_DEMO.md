# CREOVATE Hackathon Demo Notes

## Suggested three-minute walkthrough

1. Open creator discovery and search for a skill, tool, specialty, or content type. Apply the content-type filter, point out the live result count, then show that an unmatched search gives a clear empty state with a reset action.
2. Open a creator profile. Show a featured AI portfolio item, its tools and workflow details, and the trust labels. Explain that this build uses sample records: tools are creator-reported, workflow entries are illustrative, and work is sample work rather than independently verified evidence.
3. Open the brief studio and choose a preset. Review the campaign title and concept, then set content type, style, aspect ratio, delivery format, commercial-use scope, budget, and timeline. Generate the local preview and show its suggested production details and milestone split.
4. Show how a creator can review a brief and how the engagement view represents feedback and delivery. Clarify that this is a simulated prototype flow; it does not run AI generation, payments, escrow, or legal rights transfer.

## Rubric map

- Creator profiles and AI portfolios: searchable creator records show specialties, skills, tools/models, formats, workflow notes, and featured sample work.
- Brief definition: the studio captures content type, style, aspect ratio, delivery format, requested commercial-use scope, budget, and timeline.
- Discovery and filtering: search spans creator profile attributes and the UI supports tool, specialty, and content-type filters, result counts, and an empty state.
- User experience: the prototype presents creator discovery, portfolio inspection, brief creation, and a sample engagement flow in one interface.
- Presentation: use the walkthrough above and demonstrate one populated result and one empty result.
- Bonus features: visible trust signals disclose the state of sample data; the brief preview structures a rough campaign idea using local category rules.

## Data model note

### Creator profile

- Identity and profile: `id`, `name`, `role`, `location`, `bio`.
- Discovery attributes: `specialties[]`, `skills[]`, `toolstack[]`, `contentTypes[]`, and `formats[]`.
- Commercial attributes: hourly rate and starting price in INR.
- Trust signals: `verificationSignals.tools`, `verificationSignals.workflow`, and `verificationSignals.pastWork`. In this demo they are descriptive status labels, not verified credentials.
- Portfolio items: title, content category, media reference, prompt/model details, generation settings, dimensions, and workflow notes where available.

### Creative brief

- Campaign: title, brand/sample brand, category, concept, timeline, budget, and requested deliverables.
- Production requirements: `contentType`, `style`, `aspectRatio`, and `deliveryFormat`.
- Rights request: `commercialUse.scope` plus `commercialUse.status`. The scope records what the brand is asking for; it does not establish that rights were granted.
- Demo workflow: sample milestone values and simulated preview suggestions. They should be treated as illustrative values, not escrow or an AI-generated production plan.
