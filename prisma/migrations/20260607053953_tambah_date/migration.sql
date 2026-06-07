/*
  Warnings:

  - Added the required column `date` to the `Saving` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Saving" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
