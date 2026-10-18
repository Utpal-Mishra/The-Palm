# Recruiter Profile Assistant

## Status

Feature-branch implementation. This release deliberately uses deterministic, client-side matching rather than a generative model.

## Product decision

The assistant helps a recruiter understand Utpal's approved public profile and compare a job description with evidence. It must not act as an autonomous hiring evaluator or invent experience.

## Architecture

- Static HTML, CSS and JavaScript compatible with GitHub Pages.
- Curated public evidence in profile-assistant-data.js.
- Controlled intent-based profile answers in chatbot.js.
- JD comparison with three states: strong evidence, relevant but validate depth, and not evidenced publicly.
- No API key, external AI service, database or server required for V1.

## Privacy and security

- Questions and pasted job descriptions remain in the visitor's browser.
- Inputs are not persisted or transmitted by the assistant.
- User-provided text is rendered with textContent rather than innerHTML.
- Input lengths are capped.
- Only curated public evidence is available to the assistant.
- Private project logs and private conversations are excluded.
- Analytics records interaction names and aggregate match counts only; it does not send JD text or questions.

## Known limitations

- Intent matching is controlled, not open-ended generative conversation.
- Requirement recognition depends on the maintained keyword map.
- A pasted job description is not stored and cannot be resumed.
- CV download remains separate from this feature.

## Next decision gate

Only consider a serverless LLM upgrade after validating recruiter usage. A future backend must add rate limiting, prompt-injection resistance, output citations, secrets management, cost controls and request logging without retaining job-description text.
