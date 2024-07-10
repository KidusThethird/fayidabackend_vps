/*
  Warnings:

  - You are about to drop the column `CategoriesListId` on the `CategoryFolders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `CategoryFolders_CategoriesListId_fkey` ON `CategoryFolders`;

-- AlterTable
ALTER TABLE `CategoryFolders` DROP COLUMN `CategoriesListId`;
