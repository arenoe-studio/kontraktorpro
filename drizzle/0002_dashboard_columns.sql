ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "target_date" date,
  ADD COLUMN IF NOT EXISTS "completed_at" timestamp;
