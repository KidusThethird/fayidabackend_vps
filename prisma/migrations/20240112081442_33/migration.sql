-- CreateTable
CREATE TABLE `StudentAssessement` (
    `id` VARCHAR(191) NOT NULL,
    `assessmentId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `Score` VARCHAR(191) NULL,
    `CorrectAnswers` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prize` (
    `id` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NULL DEFAULT 'Prize Item',
    `itemDecription` VARCHAR(191) NULL,
    `points` VARCHAR(191) NULL DEFAULT '0',
    `visibleAtPoint` VARCHAR(191) NULL DEFAULT '0',
    `visiblity` VARCHAR(191) NULL DEFAULT '0',
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentPrize` (
    `id` VARCHAR(191) NOT NULL,
    `prizeId` VARCHAR(191) NOT NULL,
    `studentsId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentAssessement` ADD CONSTRAINT `StudentAssessement_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssessement` ADD CONSTRAINT `StudentAssessement_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assesment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPrize` ADD CONSTRAINT `StudentPrize_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPrize` ADD CONSTRAINT `StudentPrize_prizeId_fkey` FOREIGN KEY (`prizeId`) REFERENCES `Prize`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
