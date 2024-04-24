-- AlterTable
ALTER TABLE `students` ADD COLUMN `code` VARCHAR(191) NULL DEFAULT '1136',
    MODIFY `studentStatus` VARCHAR(191) NULL DEFAULT 'down';
