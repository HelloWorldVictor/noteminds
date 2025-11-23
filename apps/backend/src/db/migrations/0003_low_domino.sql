DROP INDEX `user_note_is_private_idx`;--> statement-breakpoint
ALTER TABLE `user_note` DROP COLUMN `is_private`;--> statement-breakpoint
ALTER TABLE `user_note` DROP COLUMN `tags`;--> statement-breakpoint
ALTER TABLE `user_note` DROP COLUMN `selected_text`;--> statement-breakpoint
ALTER TABLE `user_note` DROP COLUMN `selection_position`;