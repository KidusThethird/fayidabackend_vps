-- CreateTable
CREATE TABLE `CategoriesList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `Status` BOOLEAN NULL,
    `index` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryFolders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `index` INTEGER NULL DEFAULT 0,
    `CategoriesListId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KeyWordsList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `word` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryFoldersToKeyWordsList` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryFoldersToKeyWordsList_AB_unique`(`A`, `B`),
    INDEX `_CategoryFoldersToKeyWordsList_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CategoryFolders` ADD CONSTRAINT `CategoryFolders_CategoriesListId_fkey` FOREIGN KEY (`CategoriesListId`) REFERENCES `CategoriesList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryFoldersToKeyWordsList` ADD CONSTRAINT `_CategoryFoldersToKeyWordsList_A_fkey` FOREIGN KEY (`A`) REFERENCES `CategoryFolders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryFoldersToKeyWordsList` ADD CONSTRAINT `_CategoryFoldersToKeyWordsList_B_fkey` FOREIGN KEY (`B`) REFERENCES `KeyWordsList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
