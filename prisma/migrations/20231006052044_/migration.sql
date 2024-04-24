-- CreateTable
CREATE TABLE `_packagetostudents` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_packagetostudents_AB_unique`(`A`, `B`),
    INDEX `_packagetostudents_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_packagetostudents` ADD CONSTRAINT `_packagetostudents_A_fkey` FOREIGN KEY (`A`) REFERENCES `package`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_packagetostudents` ADD CONSTRAINT `_packagetostudents_B_fkey` FOREIGN KEY (`B`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
