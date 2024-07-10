-- DropForeignKey
ALTER TABLE `CategoryFolders` DROP FOREIGN KEY `CategoryFolders_CategoriesListId_fkey`;

-- CreateTable
CREATE TABLE `_CategoriesListToCategoryFolders` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoriesListToCategoryFolders_AB_unique`(`A`, `B`),
    INDEX `_CategoriesListToCategoryFolders_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoriesListToCategoryFolders` ADD CONSTRAINT `_CategoriesListToCategoryFolders_A_fkey` FOREIGN KEY (`A`) REFERENCES `CategoriesList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoriesListToCategoryFolders` ADD CONSTRAINT `_CategoriesListToCategoryFolders_B_fkey` FOREIGN KEY (`B`) REFERENCES `CategoryFolders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
