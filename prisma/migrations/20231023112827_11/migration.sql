/*
  Warnings:

  - You are about to alter the column `status` on the `package` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `package` MODIFY `status` BOOLEAN NULL DEFAULT false;
