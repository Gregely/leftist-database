ALTER TABLE `path_details` ADD `guided` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `path_details` ADD `overview` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `orientation` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `why_it_matters` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `next_reason` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `excerpt_id` text REFERENCES excerpts(id) ON DELETE set null;