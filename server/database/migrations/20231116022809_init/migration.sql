/*
  Warnings:

  - You are about to drop the column `testPaperId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_testPaperId_fkey`;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `testPaperId`;

-- CreateTable
CREATE TABLE `testPaperAndQuestion` (
    `qaId` INTEGER NOT NULL,
    `paperId` INTEGER NOT NULL,

    PRIMARY KEY (`qaId`, `paperId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `testPaperAndQuestion` ADD CONSTRAINT `testPaperAndQuestion_qaId_fkey` FOREIGN KEY (`qaId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testPaperAndQuestion` ADD CONSTRAINT `testPaperAndQuestion_paperId_fkey` FOREIGN KEY (`paperId`) REFERENCES `TestPaper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
