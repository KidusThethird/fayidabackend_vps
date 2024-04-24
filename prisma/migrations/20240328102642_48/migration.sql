-- AlterTable
ALTER TABLE `advertisement` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `assesment` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `audios` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `blogs` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `books` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `city` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `conversations` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `examtaker` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `examtakermockpackagepurchase` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `forum` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `languages` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `materials` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `mockpackage` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL,
    ADD COLUMN `group` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `package` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL,
    ADD COLUMN `group` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `paymentmethods` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `prize` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `purchaselist` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `questions` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `region` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sections` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `studentassessement` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `studentcourse` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `studentprize` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `students` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `videos` ADD COLUMN `extra1` VARCHAR(191) NULL,
    ADD COLUMN `extra2` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Collection` (
    `id` VARCHAR(191) NOT NULL,
    `field1` VARCHAR(191) NULL,
    `field2` VARCHAR(191) NULL,
    `field3` VARCHAR(191) NULL,
    `field4` VARCHAR(191) NULL,
    `field5` INTEGER NULL,
    `field6` BOOLEAN NOT NULL,
    `field7` TEXT NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
