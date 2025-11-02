CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `flashcard` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`webpage_id` text NOT NULL,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`tags` text,
	`difficulty` text DEFAULT 'medium' NOT NULL,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`ease_factor` integer DEFAULT 2500 NOT NULL,
	`interval` integer DEFAULT 1 NOT NULL,
	`next_review` integer,
	`last_reviewed` integer,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`webpage_id`) REFERENCES `webpage`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `flashcard_user_id_idx` ON `flashcard` (`user_id`);--> statement-breakpoint
CREATE INDEX `flashcard_webpage_id_idx` ON `flashcard` (`webpage_id`);--> statement-breakpoint
CREATE INDEX `flashcard_difficulty_idx` ON `flashcard` (`difficulty`);--> statement-breakpoint
CREATE INDEX `flashcard_next_review_idx` ON `flashcard` (`next_review`);--> statement-breakpoint
CREATE INDEX `flashcard_created_at_idx` ON `flashcard` (`created_at`);--> statement-breakpoint
CREATE INDEX `flashcard_user_webpage_idx` ON `flashcard` (`user_id`,`webpage_id`);--> statement-breakpoint
CREATE TABLE `question` (
	`id` text PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`question_text` text NOT NULL,
	`question_type` text DEFAULT 'multiple_choice' NOT NULL,
	`options` text,
	`correct_answer` text NOT NULL,
	`explanation` text,
	`points` integer DEFAULT 1 NOT NULL,
	`order_index` integer NOT NULL,
	`metadata` text,
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `question_quiz_id_idx` ON `question` (`quiz_id`);--> statement-breakpoint
CREATE INDEX `question_type_idx` ON `question` (`question_type`);--> statement-breakpoint
CREATE INDEX `question_order_idx` ON `question` (`quiz_id`,`order_index`);--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`webpage_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`difficulty` text DEFAULT 'medium' NOT NULL,
	`total_questions` integer DEFAULT 0 NOT NULL,
	`estimated_duration` integer NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`webpage_id`) REFERENCES `webpage`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_user_id_idx` ON `quiz` (`user_id`);--> statement-breakpoint
CREATE INDEX `quiz_webpage_id_idx` ON `quiz` (`webpage_id`);--> statement-breakpoint
CREATE INDEX `quiz_difficulty_idx` ON `quiz` (`difficulty`);--> statement-breakpoint
CREATE INDEX `quiz_created_at_idx` ON `quiz` (`created_at`);--> statement-breakpoint
CREATE INDEX `quiz_user_webpage_idx` ON `quiz` (`user_id`,`webpage_id`);--> statement-breakpoint
CREATE TABLE `quiz_attempt` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_id` text NOT NULL,
	`score` integer NOT NULL,
	`total_questions` integer NOT NULL,
	`time_spent` integer NOT NULL,
	`completed` integer DEFAULT true NOT NULL,
	`answers` text,
	`started_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_attempt_user_id_idx` ON `quiz_attempt` (`user_id`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_quiz_id_idx` ON `quiz_attempt` (`quiz_id`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_completed_idx` ON `quiz_attempt` (`completed`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_started_at_idx` ON `quiz_attempt` (`started_at`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_user_quiz_idx` ON `quiz_attempt` (`user_id`,`quiz_id`);--> statement-breakpoint
CREATE TABLE `summary` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`webpage_id` text NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'brief' NOT NULL,
	`word_count` integer NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`webpage_id`) REFERENCES `webpage`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `summary_user_id_idx` ON `summary` (`user_id`);--> statement-breakpoint
CREATE INDEX `summary_webpage_id_idx` ON `summary` (`webpage_id`);--> statement-breakpoint
CREATE INDEX `summary_type_idx` ON `summary` (`type`);--> statement-breakpoint
CREATE INDEX `summary_created_at_idx` ON `summary` (`created_at`);--> statement-breakpoint
CREATE INDEX `summary_user_webpage_idx` ON `summary` (`user_id`,`webpage_id`);--> statement-breakpoint
CREATE TABLE `user_note` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`webpage_id` text NOT NULL,
	`content` text NOT NULL,
	`is_private` integer DEFAULT true NOT NULL,
	`tags` text,
	`selected_text` text,
	`selection_position` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`webpage_id`) REFERENCES `webpage`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_note_user_id_idx` ON `user_note` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_note_webpage_id_idx` ON `user_note` (`webpage_id`);--> statement-breakpoint
CREATE INDEX `user_note_is_private_idx` ON `user_note` (`is_private`);--> statement-breakpoint
CREATE INDEX `user_note_created_at_idx` ON `user_note` (`created_at`);--> statement-breakpoint
CREATE INDEX `user_note_user_webpage_idx` ON `user_note` (`user_id`,`webpage_id`);--> statement-breakpoint
CREATE TABLE `user_preference` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`summary_preferences` text,
	`quiz_preferences` text,
	`flashcard_preferences` text,
	`ui_preferences` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preference_user_id_unique` ON `user_preference` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_preference_user_id_idx` ON `user_preference` (`user_id`);--> statement-breakpoint
CREATE TABLE `webpage` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`extracted_content` text NOT NULL,
	`content_hash` text NOT NULL,
	`metadata` text,
	`scraped_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `webpage_url_idx` ON `webpage` (`url`);--> statement-breakpoint
CREATE INDEX `webpage_content_hash_idx` ON `webpage` (`content_hash`);--> statement-breakpoint
CREATE INDEX `webpage_scraped_at_idx` ON `webpage` (`scraped_at`);