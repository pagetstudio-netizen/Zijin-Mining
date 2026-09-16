---
name: Lucky draw visual reconstruction
description: Durable constraint for reproducing the lucky-draw screens from user-provided captures.
---

User-provided screenshots for the lucky-draw experience are visual references only. The production page and its ranking/records dialogs must be rendered with real HTML, CSS, and interactive controls rather than displaying the screenshots as backgrounds or full-screen images.

**Why:** The user explicitly rejected an earlier implementation that displayed the reference captures directly; they want the same design recreated as a real interface.

**How to apply:** When adjusting the lucky-draw route, keep the visual match while preserving real buttons, dialogs, responsive layout, and accessible labels. Do not reintroduce the uploaded screenshots as rendered page content.