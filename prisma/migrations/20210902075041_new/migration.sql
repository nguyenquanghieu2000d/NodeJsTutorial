/*
  Warnings:

  - Made the column `status` on table `lop` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `mon_hoc` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `phong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `sinhvien` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `status` BIT(1) DEFAULT (b'1');

-- AlterTable
ALTER TABLE `giang_vien` MODIFY `status` BIT(1) DEFAULT (b'1');

-- AlterTable
ALTER TABLE `lop` MODIFY `status` BIT(1) NOT NULL DEFAULT (b'1');

-- AlterTable
ALTER TABLE `mon_hoc` MODIFY `status` BIT(1) NOT NULL DEFAULT (b'1');

-- AlterTable
ALTER TABLE `phong` MODIFY `status` BIT(1) NOT NULL DEFAULT (b'1');

-- AlterTable
ALTER TABLE `sinhvien` MODIFY `status` BIT(1) NOT NULL DEFAULT (b'1');

-- AlterTable
ALTER TABLE `user` MODIFY `status` BIT(1) NOT NULL DEFAULT (b'1');
