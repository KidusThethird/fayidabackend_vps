/*
  Warnings:

  - You are about to alter the column `questionIndex` on the `Questions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Questions` MODIFY `questionIndex` INTEGER NULL;
