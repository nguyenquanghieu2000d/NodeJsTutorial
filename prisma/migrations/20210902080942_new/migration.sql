/*
  Warnings:

  - Added the required column `update_at` to the `mon_hoc` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `quyen` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `status` TINYINT DEFAULT 1;

-- AlterTable
ALTER TABLE `giang_vien` MODIFY `status` TINYINT DEFAULT 1;

-- AlterTable
ALTER TABLE `lop` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `mon_hoc` ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL,
    MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `phong` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `quyen` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `sinhvien` MODIFY `status` TINYINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `user` MODIFY `status` TINYINT NOT NULL DEFAULT 1;
