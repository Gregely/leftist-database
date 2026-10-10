CREATE TABLE `entity_places` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`place_id` text NOT NULL,
	`role` text NOT NULL,
	`year_start` integer,
	`year_end` integer,
	`note` text DEFAULT '' NOT NULL,
	`source_id` text,
	`locator` text,
	`position` integer DEFAULT 0 NOT NULL,
	`staged_for` text,
	`created_by` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `entity_places_entity` ON `entity_places` (`entity_id`);--> statement-breakpoint
CREATE INDEX `entity_places_place` ON `entity_places` (`place_id`);--> statement-breakpoint
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`kind` text DEFAULT 'settlement' NOT NULL,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`modern_name` text DEFAULT '' NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`historical_note` text DEFAULT '' NOT NULL,
	`aliases` text DEFAULT '[]' NOT NULL,
	`matches` text DEFAULT '[]' NOT NULL,
	`wikidata_id` text,
	`coord_source` text DEFAULT '' NOT NULL,
	`created_by` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `places_slug` ON `places` (`slug`);