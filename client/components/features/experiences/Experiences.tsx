"use client";

import { fetchExperiences } from "@/app/services/experiences";
import { Label } from "@/components/ui/label";
import { Experience } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddExperienceButton } from "./AddExperienceButton";

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchExperiences();
        setExperiences(data);
      } catch (error) {
        console.error(error);
        toast.error("An error occured fetching experiences");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="border border-primary px-5 py-2 flex flex-col gap-4">
      <h3 className="text-2xl font-semibold">Experiences</h3>
      {experiences.map((experience) => {
        return (
          <div key={String(experience.id)}>
            <Label>
              {experience.type} - {experience.name}
            </Label>
            <div>{experience.description}</div>
          </div>
        );
      })}
      <AddExperienceButton />
    </div>
  );
};

export default Experiences;
