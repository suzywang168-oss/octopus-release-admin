CREATE TABLE `admin_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`view_key` text NOT NULL,
	`position` integer NOT NULL,
	`payload` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_records_view_position_idx` ON `admin_records` (`view_key`,`position`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`view_key` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` integer NOT NULL
);
