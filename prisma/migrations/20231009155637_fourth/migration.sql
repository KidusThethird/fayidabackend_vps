-- AlterTable
ALTER TABLE `package` ADD COLUMN `sectionsId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `package` ADD CONSTRAINT `package_sectionsId_fkey` FOREIGN KEY (`sectionsId`) REFERENCES `Sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
