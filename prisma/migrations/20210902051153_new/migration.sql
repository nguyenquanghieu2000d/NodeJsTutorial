/*
  Warnings:

  - Added the required column `status` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `status` BIT(1);

-- AlterTable
ALTER TABLE `giang_vien` ADD COLUMN `status` BIT(1);

-- AlterTable
ALTER TABLE `lop` ADD COLUMN `status` INTEGER;

-- AlterTable
ALTER TABLE `mon_hoc` ADD COLUMN `status` BIT(1);

-- AlterTable
ALTER TABLE `phong` ADD COLUMN `status` BIT(1);

-- AlterTable
ALTER TABLE `quyen` ADD COLUMN `status` BIT(1);

-- AlterTable
ALTER TABLE `sinhvien` ADD COLUMN `status` BIT(1);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` BIT(1) NOT NULL;
