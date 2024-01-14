/*
  Warnings:

  - You are about to drop the `testPaperAndQuestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `testPaperId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `testPaperAndQuestion` DROP FOREIGN KEY `testPaperAndQuestion_paperId_fkey`;

-- DropForeignKey
ALTER TABLE `testPaperAndQuestion` DROP FOREIGN KEY `testPaperAndQuestion_qaId_fkey`;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `testPaperId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `testPaperAndQuestion`;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_testPaperId_fkey` FOREIGN KEY (`testPaperId`) REFERENCES `TestPaper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
