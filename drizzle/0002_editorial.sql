CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text,
	`target_label` text DEFAULT '' NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_created` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE INDEX `audit_target` ON `audit_log` (`target_id`);--> statement-breakpoint
CREATE INDEX `audit_actor` ON `audit_log` (`actor_id`);--> statement-breakpoint
CREATE TABLE `editorial_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`author_id` text,
	`kind` text DEFAULT 'note' NOT NULL,
	`field` text,
	`quote` text,
	`body` text NOT NULL,
	`resolved` integer DEFAULT false NOT NULL,
	`resolved_by` text,
	`resolved_at` text,
	`revision` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `editorial_notes_entity` ON `editorial_notes` (`entity_id`);--> statement-breakpoint
CREATE TABLE `entity_media` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`media_id` text NOT NULL,
	`role` text DEFAULT 'figure' NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entity_media_unique` ON `entity_media` (`entity_id`,`media_id`,`role`);--> statement-breakpoint
CREATE INDEX `entity_media_media` ON `entity_media` (`media_id`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`sha256` text NOT NULL,
	`file_name` text NOT NULL,
	`original_name` text DEFAULT '' NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`title` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`alt_text` text DEFAULT '' NOT NULL,
	`creator` text DEFAULT '' NOT NULL,
	`credit` text DEFAULT '' NOT NULL,
	`source_text` text DEFAULT '' NOT NULL,
	`source_id` text,
	`license` text DEFAULT '' NOT NULL,
	`rights` text DEFAULT '' NOT NULL,
	`year` integer,
	`tags` text DEFAULT '[]' NOT NULL,
	`uploaded_by` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_sha` ON `media` (`sha256`);--> statement-breakpoint
CREATE TABLE `revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`version` integer NOT NULL,
	`snapshot` text NOT NULL,
	`changed_fields` text DEFAULT '[]' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text NOT NULL,
	`author_id` text,
	`sealed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `revisions_entity_version` ON `revisions` (`entity_id`,`version`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `slug_history` (
	`kind` text NOT NULL,
	`slug` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`kind`, `slug`),
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'contributor' NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`last_login_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `concept_details` ADD `history` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `concept_details` ADD `interpretations` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `concept_details` ADD `criticisms` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `debate_details` ADD `context` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `live` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `is_sample` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `author_id` text;--> statement-breakpoint
ALTER TABLE `entities` ADD `reviewer_id` text;--> statement-breakpoint
ALTER TABLE `entities` ADD `last_edited_by` text;--> statement-breakpoint
ALTER TABLE `entities` ADD `lock_version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `revision` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `published_revision` integer;--> statement-breakpoint
ALTER TABLE `entities` ADD `published_at` text;--> statement-breakpoint
ALTER TABLE `entities` ADD `submitted_at` text;--> statement-breakpoint
CREATE INDEX `entities_live` ON `entities` (`live`,`kind`);--> statement-breakpoint
CREATE INDEX `entities_status` ON `entities` (`status`);--> statement-breakpoint
CREATE INDEX `entities_author` ON `entities` (`author_id`);--> statement-breakpoint
ALTER TABLE `event_details` ADD `significance` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `excerpts` ADD `verification` text DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE `excerpts` ADD `speaker_id` text REFERENCES entities(id);--> statement-breakpoint
ALTER TABLE `excerpts` ADD `created_by` text;--> statement-breakpoint
ALTER TABLE `path_details` ADD `prerequisites` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `track` text DEFAULT 'main' NOT NULL;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `parent_step_id` text;--> statement-breakpoint
ALTER TABLE `relationships` ADD `year_start` integer;--> statement-breakpoint
ALTER TABLE `relationships` ADD `year_end` integer;--> statement-breakpoint
ALTER TABLE `relationships` ADD `context` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `relationships` ADD `created_by` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `edition` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `translator` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `editors` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `place` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `container_title` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `isbn` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `created_by` text;--> statement-breakpoint
ALTER TABLE `tendency_details` ADD `context` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `tendency_details` ADD `criticisms` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `tendency_details` ADD `legacy` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `text_details` ADD `edition` text;--> statement-breakpoint
ALTER TABLE `text_details` ADD `context` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `thinker_details` ADD `context` text DEFAULT '' NOT NULL;--> statement-breakpoint
-- Data migration: public visibility moves from `status` to the `live` flag,
-- and "sample" becomes a marker rather than a workflow state.
UPDATE `entities` SET `live` = 1 WHERE `status` IN ('sample', 'published');--> statement-breakpoint
UPDATE `entities` SET `is_sample` = 1, `status` = 'published' WHERE `status` = 'sample';--> statement-breakpoint
UPDATE `entities` SET `status` = 'under_review' WHERE `status` = 'review';--> statement-breakpoint
UPDATE `entities` SET `published_revision` = 0, `published_at` = `updated_at` WHERE `live` = 1;--> statement-breakpoint
UPDATE `excerpts` SET `verification` = CASE WHEN `verified` = 1 THEN 'verified' ELSE 'unverified' END;
