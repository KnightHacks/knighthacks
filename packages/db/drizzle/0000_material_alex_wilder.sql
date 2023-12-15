CREATE TABLE `hackathons` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`start_date` text,
	`end_date` text,
	`theme` text
);
--> statement-breakpoint
CREATE TABLE `hackers` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`hackathon_id` integer,
	`status` text,
	`why_attend` text,
	`what_learn` text
);
--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`logo` text,
	`website` text,
	`tier` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text,
	`last_name` text,
	`name` text,
	`state` text,
	`school` text,
	`major` text,
	`grad_year` text,
	`address1` text,
	`address2` text,
	`phone` text(20),
	`email` text,
	`city` text,
	`shirt_size` text,
	`personal_website` text,
	`github` text,
	`linkedin` text,
	`resume` text,
	`is_member` integer,
	`is_admin` integer,
	`oauth_provider` text,
	`oauth_id` text,
	`zip` text
);
