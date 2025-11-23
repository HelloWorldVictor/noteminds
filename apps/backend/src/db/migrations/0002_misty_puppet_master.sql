DROP TABLE `question`;--> statement-breakpoint
DROP TABLE `quiz_attempt`;--> statement-breakpoint
DROP INDEX `quiz_difficulty_idx`;--> statement-breakpoint
ALTER TABLE `quiz` ADD `questions` text NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `quiz` DROP COLUMN `difficulty`;--> statement-breakpoint
ALTER TABLE `quiz` DROP COLUMN `total_questions`;--> statement-breakpoint
ALTER TABLE `quiz` DROP COLUMN `estimated_duration`;--> statement-breakpoint
ALTER TABLE `quiz` DROP COLUMN `metadata`;