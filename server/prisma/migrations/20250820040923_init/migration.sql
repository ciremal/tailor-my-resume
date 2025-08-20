/*
  Warnings:

  - Added the required column `contentType` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Resume" ADD COLUMN     "contentType" TEXT NOT NULL;
