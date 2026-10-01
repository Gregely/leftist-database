CREATE TABLE `citations` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`source_id` text NOT NULL,
	`locator` text,
	`field` text,
	`note` text DEFAULT '' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `citations_entity` ON `citations` (`entity_id`);--> statement-breakpoint
CREATE INDEX `citations_source` ON `citations` (`source_id`);--> statement-breakpoint
CREATE TABLE `concept_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`brief` text DEFAULT '' NOT NULL,
	`standard` text DEFAULT '' NOT NULL,
	`deep` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `debate_arguments` (
	`id` text PRIMARY KEY NOT NULL,
	`debate_id` text NOT NULL,
	`position_id` text,
	`kind` text DEFAULT 'argument' NOT NULL,
	`responds_to_id` text,
	`body` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`debate_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`position_id`) REFERENCES `debate_positions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `debate_arguments_debate` ON `debate_arguments` (`debate_id`,`position`);--> statement-breakpoint
CREATE TABLE `debate_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`intro` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `debate_positions` (
	`id` text PRIMARY KEY NOT NULL,
	`debate_id` text NOT NULL,
	`holder_id` text,
	`label` text NOT NULL,
	`central_claim` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`assumptions` text DEFAULT '[]' NOT NULL,
	`criticisms` text DEFAULT '[]' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`debate_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`holder_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `debate_positions_debate` ON `debate_positions` (`debate_id`,`position`);--> statement-breakpoint
CREATE TABLE `debate_propositions` (
	`id` text PRIMARY KEY NOT NULL,
	`debate_id` text NOT NULL,
	`statement` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`debate_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `debate_propositions_debate` ON `debate_propositions` (`debate_id`,`position`);--> statement-breakpoint
CREATE TABLE `entities` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`summary` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`aliases` text DEFAULT '[]' NOT NULL,
	`year_start` integer,
	`year_end` integer,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 1000 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entities_kind_slug` ON `entities` (`kind`,`slug`);--> statement-breakpoint
CREATE INDEX `entities_kind` ON `entities` (`kind`,`sort_order`);--> statement-breakpoint
CREATE INDEX `entities_year` ON `entities` (`year_start`);--> statement-breakpoint
CREATE TABLE `event_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`date_label` text,
	`place` text,
	`event_type` text DEFAULT 'movement' NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `excerpts` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`text_id` text,
	`source_id` text,
	`body` text DEFAULT '' NOT NULL,
	`locator` text,
	`note` text DEFAULT '' NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`text_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `excerpts_entity` ON `excerpts` (`entity_id`);--> statement-breakpoint
CREATE TABLE `path_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`entry_line` text DEFAULT '' NOT NULL,
	`level` text DEFAULT 'introductory' NOT NULL,
	`estimated_time` text,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `path_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`path_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`position` integer NOT NULL,
	`framing` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`path_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `path_steps_path` ON `path_steps` (`path_id`,`position`);--> statement-breakpoint
CREATE TABLE `position_links` (
	`position_id` text NOT NULL,
	`entity_id` text NOT NULL,
	PRIMARY KEY(`position_id`, `entity_id`),
	FOREIGN KEY (`position_id`) REFERENCES `debate_positions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `position_stances` (
	`position_id` text NOT NULL,
	`proposition_id` text NOT NULL,
	`stance` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`position_id`, `proposition_id`),
	FOREIGN KEY (`position_id`) REFERENCES `debate_positions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`proposition_id`) REFERENCES `debate_propositions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `relationships` (
	`id` text PRIMARY KEY NOT NULL,
	`from_id` text NOT NULL,
	`to_id` text NOT NULL,
	`type` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`weight` integer DEFAULT 2 NOT NULL,
	`source_id` text,
	`locator` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`from_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `relationships_unique` ON `relationships` (`from_id`,`type`,`to_id`);--> statement-breakpoint
CREATE INDEX `relationships_from` ON `relationships` (`from_id`);--> statement-breakpoint
CREATE INDEX `relationships_to` ON `relationships` (`to_id`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text DEFAULT '' NOT NULL,
	`publication_date` text,
	`publisher` text,
	`url` text,
	`source_type` text DEFAULT 'SECONDARY' NOT NULL,
	`locator` text,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sources_type` ON `sources` (`source_type`);--> statement-breakpoint
CREATE TABLE `tendency_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`color` text DEFAULT 'ink' NOT NULL,
	`period_label` text,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `text_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`original_title` text,
	`language` text,
	`form` text DEFAULT 'book' NOT NULL,
	`publication_note` text,
	`difficulty` integer DEFAULT 2 NOT NULL,
	`reading_url` text,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `thinker_details` (
	`entity_id` text PRIMARY KEY NOT NULL,
	`roles` text DEFAULT '' NOT NULL,
	`birth_place` text,
	`death_place` text,
	`legacy` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
