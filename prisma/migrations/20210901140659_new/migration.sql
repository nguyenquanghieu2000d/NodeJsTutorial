-- AlterTable
ALTER TABLE `lop` ADD COLUMN `fk_giang_vien` VARCHAR(40);

-- CreateIndex
CREATE INDEX `lop_giang_vien_id_fk` ON `lop`(`fk_giang_vien`);

-- AddForeignKey
ALTER TABLE `lop` ADD FOREIGN KEY (`fk_giang_vien`) REFERENCES `giang_vien`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
