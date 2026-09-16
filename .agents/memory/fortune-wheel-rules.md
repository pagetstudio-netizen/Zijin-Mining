---
name: Fortune wheel eligibility
description: Business rules for granting and paying out fortune wheel spins.
---

The first paid investment purchase grants the buyer one free spin. A referrer receives one additional spin for each referred user only after that referred user has both an approved deposit and a paid investment purchase. Administrators can grant extra spins manually.

**Why:** A signup alone must not unlock the wheel; the reward is tied to real investment qualification, while administrators need controlled exceptions.

**How to apply:** Keep automatic grants idempotent per buyer or qualified referred user. Preserve the wheel’s displayed values if the visual contract requires them, but enforce the real payout ceiling server-side at 500 FCFA and show the actual credited reward in the records popup.