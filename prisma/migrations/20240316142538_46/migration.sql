-- AlterTable
ALTER TABLE `courses` ADD COLUMN `courseIntroductionVideo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `questions` ADD COLUMN `correctionImage` VARCHAR(191) NULL,
    ADD COLUMN `questionImage` VARCHAR(191) NULL;
