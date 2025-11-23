DROP INDEX `flashcard_difficulty_idx`;--> statement-breakpoint
DROP INDEX `flashcard_next_review_idx`;--> statement-breakpoint
ALTER TABLE `flashcard` ADD `practice_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `tags`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `difficulty`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `repetitions`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `ease_factor`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `interval`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `next_review`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `last_reviewed`;--> statement-breakpoint
ALTER TABLE `flashcard` DROP COLUMN `metadata`;