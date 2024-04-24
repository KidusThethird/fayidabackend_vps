/*
  Warnings:

  - A unique constraint covering the columns `[materialIndex]` on the table `Materials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Materials_materialIndex_key` ON `Materials`(`materialIndex`);
