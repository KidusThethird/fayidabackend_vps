-- AlterTable
ALTER TABLE `BotQuestionAnswer` ADD COLUMN `questionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `BotQuestionAnswer` ADD CONSTRAINT `BotQuestionAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BotQuestions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
