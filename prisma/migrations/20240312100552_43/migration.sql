-- AlterTable
ALTER TABLE `examtaker` ADD COLUMN `phoneNumber` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ExamTakerMockPackagePurchase` (
    `id` VARCHAR(191) NOT NULL,
    `examTakerId` VARCHAR(191) NOT NULL,
    `mockPackageId` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NULL DEFAULT 'pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExamTakerMockPackagePurchase` ADD CONSTRAINT `ExamTakerMockPackagePurchase_mockPackageId_fkey` FOREIGN KEY (`mockPackageId`) REFERENCES `MockPackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamTakerMockPackagePurchase` ADD CONSTRAINT `ExamTakerMockPackagePurchase_examTakerId_fkey` FOREIGN KEY (`examTakerId`) REFERENCES `ExamTaker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
