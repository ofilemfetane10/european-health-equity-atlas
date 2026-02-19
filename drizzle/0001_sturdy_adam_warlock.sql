CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(3) NOT NULL,
	`name` varchar(100) NOT NULL,
	`region` varchar(50) NOT NULL,
	`population` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_code_unique` UNIQUE(`code`),
	CONSTRAINT `countries_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `ehei_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`overallScore` int,
	`physicianInequality` int,
	`infrastructureInequality` int,
	`outcomeInequality` int,
	`recoveryInequality` int,
	`trend` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ehei_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`year` int NOT NULL,
	`decisionType` varchar(50) NOT NULL,
	`budgetAllocated` int,
	`outcome` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`countryId` int NOT NULL,
	`currentYear` int NOT NULL DEFAULT 2024,
	`endYear` int NOT NULL DEFAULT 2030,
	`budget` int,
	`lifeExpectancy` int,
	`lifeExpectancyDecimal` int,
	`physicianDensity` int,
	`hospitalBeds` int,
	`score` int DEFAULT 0,
	`status` enum('active','completed','abandoned') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthcare_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryId` int NOT NULL,
	`year` int NOT NULL,
	`physicianDensity` int,
	`hospitalBeds` int,
	`lifeExpectancy` int,
	`lifeExpectancyDecimal` int,
	`healthyLifeYears` int,
	`covidRecoveryYears` int,
	`generalPractitioners` int,
	`medicalSpecialists` int,
	`surgicalSpecialists` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `healthcare_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`username` varchar(100) NOT NULL,
	`countryName` varchar(100) NOT NULL,
	`finalLifeExpectancy` int,
	`finalLifeExpectancyDecimal` int,
	`score` int NOT NULL,
	`strategy` varchar(100),
	`completedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `game_decisions` ADD CONSTRAINT `game_decisions_sessionId_game_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `game_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_countryId_countries_id_fk` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `healthcare_metrics` ADD CONSTRAINT `healthcare_metrics_countryId_countries_id_fk` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leaderboard` ADD CONSTRAINT `leaderboard_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;