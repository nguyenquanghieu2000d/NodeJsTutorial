/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `sinhvien` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `update_at` to the `buoi_hoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `lop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `buoi_hoc` ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `lop` ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sinhvien.email_unique` ON `sinhvien`(`email`);
