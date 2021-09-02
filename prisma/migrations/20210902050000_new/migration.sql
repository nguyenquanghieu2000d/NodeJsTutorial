/*
  Warnings:

  - A unique constraint covering the columns `[fk_profile]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user.fk_profile_unique` ON `user`(`fk_profile`);
