-- CreateTable
CREATE TABLE `StudentMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `StudentId` VARCHAR(191) NOT NULL,
    `MaterialId` VARCHAR(191) NOT NULL,
    `Done` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentMaterial` ADD CONSTRAINT `StudentMaterial_StudentId_fkey` FOREIGN KEY (`StudentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentMaterial` ADD CONSTRAINT `StudentMaterial_MaterialId_fkey` FOREIGN KEY (`MaterialId`) REFERENCES `Materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
