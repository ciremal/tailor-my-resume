"use client";

import { fetchExperiences } from "@/app/services/experiences";
import { Experience } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddExperienceButton } from "./AddExperienceButton";
import { Label } from "@radix-ui/react-dropdown-menu";

export interface Experiences extends Experience {
  selected: boolean;
}

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experiences[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchExperiences();
        const data = res.map((exp: Experience) => {
          return {
            ...exp,
            selected: false,
          };
        });
        setExperiences(data);
      } catch (error) {
        console.error(error);
        toast.error("An error occured fetching experiences");
      }
    };
    fetchData();
  }, []);

  const handleSelectExperience = (id: string) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, selected: !exp.selected } : exp
      )
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-semibold">Experiences</h3>
      <div className="flex flex-col">
        {experiences.map((experience) => {
          return (
            <div
              key={String(experience.id)}
              className={`border-t border-primary px-2 py-3 last:border-b cursor-pointer transition-all duration-200 transform
                ${
                  experience.selected ? " bg-purple-100" : "hover:bg-gray-100"
                }`}
              onClick={() => handleSelectExperience(experience.id)}
            >
              <div
                className={`transition-all duration-200 transform ${
                  experience.selected ? "scale-95" : ""
                }`}
              >
                <p className="font-semibold">
                  {experience.type} - {experience.name}
                </p>
                <div>{experience.description}</div>
                <div className="flex gap-2 mt-2">
                  {experience.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="border-2 border-primary px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      <Label className="text-sm">{skill.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AddExperienceButton setExperiences={setExperiences} />
    </div>
  );
};

export default Experiences;
