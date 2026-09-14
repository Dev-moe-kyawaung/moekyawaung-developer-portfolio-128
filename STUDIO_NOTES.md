# Plasma / Synthwave Portfolio

The entry point is `src/App.tsx`. The new landing experience lives in `src/studio/`.

## Included

- Two persisted visual modes: Plasma Reactor and Synthwave.
- Full-bleed locally generated scene artwork in `public/images/`.
- SVG containment rings, a bounded particle canvas, a heat-distortion effect, and a synthwave grid.
- Six project modules with source links, architecture inspection, and clearly labeled engineering targets.
- An interactive reactor playground with power, pause, and reset controls.
- A profile using the supplied Cloudinary image and owner-provided bio links.
- An accessible native-dialog module inspector and responsive navigation.
- A NOVA companion with curated local engineering answers and a matching arcade presentation.
- An email-draft contact form and a text-format resume download.
- Existing reference pages remain accessible through Explore. Their earlier illustrative content is explicitly labeled.

## Service Configuration

Copy `.env.example` to `.env` and configure the optional endpoints before building.

`VITE_ASSISTANT_ENDPOINT` should point to your own server-side AI proxy. The browser sends recent chat messages and non-sensitive portfolio context. Return `{ "reply": "..." }`. Provider credentials must stay server-side. Without this endpoint, NOVA is a local, curated guide, not a generative AI service. The UI states this clearly. A failed server request falls back to a labeled local answer.

`VITE_CONTACT_ENDPOINT` accepts `{ name, email, subject, message }` and must return a successful HTTP status only after the service accepts the message. Without it, the validated form opens the visitor's email app and does not claim to have sent anything. Production endpoints should add input validation, rate limiting, spam protection, appropriate CORS, and a retention policy.

## Content Provenance

The bio source supplied by the owner is `https://pastebin.com/mQF1iP5P`. The source was readable and contained profile images, repositories, and social links. Those links are used, but this does not constitute independent verification of employment, benchmarks, or certifications.

Module interface previews are design studies. Performance values are targets, not repository measurements. No analytics or live device benchmarks are presented as real telemetry.

## Motion and Accessibility

System reduced-motion preferences are respected. Visitors may also pause motion in the header or footer. The particle canvas stops when hidden or off-screen; it does not poll React state every frame. Dialogs use native modal behavior, and architecture tabs support arrow keys, Home, and End. All new icon-only controls have accessible names.

## Verification

The production bundle was verified using the provided `build_project` tool. Browser-based end-to-end tests and real server integrations were not available in this environment. Test configured endpoints, mail-client handling, third-party profile asset availability, and mobile devices before deployment.