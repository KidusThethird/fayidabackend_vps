-- AlterTable
ALTER TABLE `BotQuestions` ADD COLUMN `choice` BOOLEAN NULL,
    ADD COLUMN `correct_choice` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `resources` ADD COLUMN `status` BOOLEAN NULL DEFAULT false;
