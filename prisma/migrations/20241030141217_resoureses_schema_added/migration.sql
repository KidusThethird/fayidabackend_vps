-- CreateTable
CREATE TABLE `resources` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `fileDescription` TEXT NULL,
    `grade` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
