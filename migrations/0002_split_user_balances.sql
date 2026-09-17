ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "deposit_balance" decimal(15,2) NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "withdrawal_balance" decimal(15,2) NOT NULL DEFAULT 0;
--> statement-breakpoint
UPDATE "users"
SET "withdrawal_balance" = "balance"
WHERE "deposit_balance" = 0
  AND "withdrawal_balance" = 0
  AND "balance" <> 0;