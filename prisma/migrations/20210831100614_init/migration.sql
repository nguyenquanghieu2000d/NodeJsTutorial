-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(50),
    `gioi_tinh` VARCHAR(10),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buoi_hoc` (
    `id` VARCHAR(40) NOT NULL,
    `fk_phan_cong` VARCHAR(40) NOT NULL,
    `fk_phong` VARCHAR(40) NOT NULL,
    `thoi_gian_bat_dau` DATETIME(0) NOT NULL,
    `so_tiet` INTEGER NOT NULL,

    INDEX `fk_phan_cong`(`fk_phan_cong`),
    INDEX `fk_phong`(`fk_phong`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `giang_vien` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(50) NOT NULL,
    `gioi_tinh` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lop` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(50) NOT NULL,
    `nam_hoc` INTEGER NOT NULL,
    `ki` INTEGER NOT NULL,

    UNIQUE INDEX `lop.ten_unique`(`ten`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mon_hoc` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(50) NOT NULL,
    `stc` INTEGER NOT NULL,

    UNIQUE INDEX `mon_hoc.ten_unique`(`ten`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phancong` (
    `id` VARCHAR(40) NOT NULL,
    `fk_giangvien` VARCHAR(40) NOT NULL,
    `fk_lop` VARCHAR(40) NOT NULL,
    `fk_mon_hoc` VARCHAR(40) NOT NULL,
    `loai` INTEGER NOT NULL,

    INDEX `fk_giangvien`(`fk_giangvien`, `fk_mon_hoc`, `fk_lop`),
    INDEX `phancong_lop_id_fk`(`fk_lop`),
    INDEX `phancong_mon_hoc_id_fk`(`fk_mon_hoc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phong` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(10),
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quyen` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(50) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `quyen.ten_unique`(`ten`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sinhvien` (
    `id` VARCHAR(40) NOT NULL,
    `ten` VARCHAR(100) NOT NULL,
    `fk_lop` VARCHAR(40),
    `gioi_tinh` VARCHAR(10),
    `email` VARCHAR(50),

    INDEX `sinhvien_lop_id_fk`(`fk_lop`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(40) NOT NULL,
    `username` VARCHAR(18) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `fk_quyen` VARCHAR(40),
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `fk_profile` VARCHAR(40),

    UNIQUE INDEX `user.username_unique`(`username`),
    UNIQUE INDEX `user.password_unique`(`password`),
    INDEX `user_quyen_id_fk`(`fk_quyen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `buoi_hoc` ADD FOREIGN KEY (`fk_phan_cong`) REFERENCES `phancong`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buoi_hoc` ADD FOREIGN KEY (`fk_phong`) REFERENCES `phong`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phancong` ADD FOREIGN KEY (`fk_giangvien`) REFERENCES `giang_vien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phancong` ADD FOREIGN KEY (`fk_lop`) REFERENCES `lop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phancong` ADD FOREIGN KEY (`fk_mon_hoc`) REFERENCES `mon_hoc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sinhvien` ADD FOREIGN KEY (`fk_lop`) REFERENCES `lop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD FOREIGN KEY (`fk_quyen`) REFERENCES `quyen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
