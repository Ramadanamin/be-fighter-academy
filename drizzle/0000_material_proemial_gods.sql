CREATE TABLE `crm_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`trainee_type` text DEFAULT 'recommend' NOT NULL,
	`child_age` text,
	`training_type` text DEFAULT 'not_sure' NOT NULL,
	`participants` text,
	`goal` text DEFAULT '' NOT NULL,
	`area` text DEFAULT 'other' NOT NULL,
	`preferred_time` text,
	`package_choice` text,
	`notes` text DEFAULT '' NOT NULL,
	`language` text DEFAULT 'ar' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`follow_up_at` text,
	`crm_notes` text DEFAULT '' NOT NULL,
	`last_contacted_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_leads_status_created_at` ON `leads` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_leads_follow_up_at` ON `leads` (`follow_up_at`);
--> statement-breakpoint
PRAGMA optimize;
