-- CreateTable
CREATE TABLE `Advertisement` (
    `id` VARCHAR(191) NOT NULL,
    `displayOnHome` VARCHAR(191) NOT NULL DEFAULT 'false',
    `title` VARCHAR(191) NULL,
    `subtitle` VARCHAR(191) NULL,
    `text` TEXT NULL,
    `subtext` TEXT NULL,
    `info` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
