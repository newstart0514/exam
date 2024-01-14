/*
  Warnings:

  - You are about to drop the column `paperTime` on the `TestPaper` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `TestPaper` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `TestPaper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestPaper` DROP COLUMN `paperTime`,
    ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL;
