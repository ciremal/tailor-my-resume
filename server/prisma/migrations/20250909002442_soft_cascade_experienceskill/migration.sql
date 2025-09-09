-- DropForeignKey
ALTER TABLE "public"."ExperienceSkill" DROP CONSTRAINT "ExperienceSkill_experienceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExperienceSkill" DROP CONSTRAINT "ExperienceSkill_skillId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ExperienceSkill" ADD CONSTRAINT "ExperienceSkill_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperienceSkill" ADD CONSTRAINT "ExperienceSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
