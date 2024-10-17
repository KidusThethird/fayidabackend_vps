-- CreateTable
CREATE TABLE `BotQuestions` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `period` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'down',
    `studentLimit` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BotQuestionAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NULL,
    `text` TEXT NULL,
    `correct` VARCHAR(191) NULL DEFAULT 'waiting',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BotQuestionAnswer` ADD CONSTRAINT `BotQuestionAnswer_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
