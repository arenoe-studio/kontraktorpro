CREATE TYPE "public"."auth_intent" AS ENUM('register', 'login', 'forgot-password');--> statement-breakpoint
CREATE TABLE "otp_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flow" "auth_intent" NOT NULL,
	"email" varchar(255) NOT NULL,
	"code_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"resend_available_at" timestamp NOT NULL,
	"resend_count" integer DEFAULT 0 NOT NULL,
	"attempts_remaining" integer DEFAULT 5 NOT NULL,
	"locked_until" timestamp,
	"is_verified" boolean DEFAULT false NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "suspended" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_login" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");