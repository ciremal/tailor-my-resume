"use client";

import { deleteExperience, fetchExperiences } from "@/app/services/experiences";
import { Experience } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddExperienceButton } from "./AddExperienceButton";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      toast.success("Successfully deleted item");
    } catch (error) {
      console.error(error);
      toast.error("An error occured trying to delete this item.");
    }
  };

  const selectedExperiences = experiences.filter((exp) => exp.selected);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold">Experiences</h3>
        <button
          disabled={selectedExperiences.length === 0}
          className={cn(
            "border-2 px-4 py-1 rounded-md transition-all duration-200",
            "disabled:border-red-300 disabled:text-red-300",
            selectedExperiences.length > 0
              ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
              : "border-red-300 text-red-300"
          )}
          onClick={() => console.log("Clicked")}
        >
          <Trash size={20} />
        </button>
      </div>
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
                <div className="flex justify-end">
                  <div className="flex justify-between gap-2">
                    <Button
                      size={"icon"}
                      className="hover:bg-secondary hover:text-white transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      size={"icon"}
                      className="hover:bg-red-600 hover:text-white transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExperience(experience.id);
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
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
