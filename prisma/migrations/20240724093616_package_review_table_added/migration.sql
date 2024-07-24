-- CreateTable
CREATE TABLE `packagesReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `packageId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `text` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `packagesReview` ADD CONSTRAINT `packagesReview_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packagesReview` ADD CONSTRAINT `packagesReview_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
