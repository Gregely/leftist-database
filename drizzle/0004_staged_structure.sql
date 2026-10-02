DROP INDEX `relationships_unique`;--> statement-breakpoint
ALTER TABLE `relationships` ADD `staged_for` text;--> statement-breakpoint
CREATE UNIQUE INDEX `relationships_staged_unique` ON `relationships` (`from_id`,`type`,`to_id`,`staged_for`) WHERE staged_for IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `relationships_unique` ON `relationships` (`from_id`,`type`,`to_id`) WHERE staged_for IS NULL;--> statement-breakpoint
ALTER TABLE `citations` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `debate_arguments` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `debate_arguments` ADD `origin_id` text;--> statement-breakpoint
ALTER TABLE `debate_positions` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `debate_positions` ADD `origin_id` text;--> statement-breakpoint
ALTER TABLE `debate_propositions` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `debate_propositions` ADD `origin_id` text;--> statement-breakpoint
ALTER TABLE `entities` ADD `staged_changes` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `staged_structure` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `entities` ADD `editorial_tags` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `entity_media` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `excerpts` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `staged_for` text;--> statement-breakpoint
ALTER TABLE `path_steps` ADD `origin_id` text;