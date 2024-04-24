-- DropForeignKey
ALTER TABLE `examtakermockpackagepurchase` DROP FOREIGN KEY `ExamTakerMockPackagePurchase_examTakerId_fkey`;

-- AlterTable
ALTER TABLE `examtakermockpackagepurchase` MODIFY `examTakerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ExamTakerMockPackagePurchase` ADD CONSTRAINT `ExamTakerMockPackagePurchase_examTakerId_fkey` FOREIGN KEY (`examTakerId`) REFERENCES `ExamTaker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
