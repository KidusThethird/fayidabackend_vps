-- AlterTable
ALTER TABLE `package` ADD COLUMN `displayOnHome` BOOLEAN NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Blogs` (
    `id` VARCHAR(191) NOT NULL,
    `writtenBy` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `subTitle` VARCHAR(191) NULL,
    `text` TEXT NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Books` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
