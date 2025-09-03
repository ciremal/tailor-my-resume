"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skill } from "@/lib/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addSkill, fetchSkills } from "@/app/services/skills";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSkills();
        setSkills(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch skills");
      }
    };
    fetchData();
  }, []);

  const [input, setInput] = useState("");

  const handleAddSkill = async () => {
    try {
      if (!input) {
        return;
      }

      const skill = skills.find(
        (s) => s.name.toLowerCase() === input.toLowerCase()
      );
      if (!skill) {
        const newSkill = await addSkill(input);
        setSkills((prev) => [...prev, newSkill]);
        setInput("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later");
      console.error(error);
    }
  };

  const handleRemoveSkill = (skill: Skill) => {};

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 border border-primary px-6 py-4">
        {skills.map((skill) => {
          return (
            <div
              key={String(skill.id)}
              className="border-2 border-primary px-2 py-1 rounded-md flex items-center gap-1"
            >
              <Label>{skill.name}</Label>
              <X
                size={"1rem"}
                className="hover:opacity-50 cursor-pointer"
                onClick={() => handleRemoveSkill(skill)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex w-1/3 gap-3">
        <Input
          placeholder="Enter skill..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border-primary"
        />
        <Button onClick={() => handleAddSkill()} className="cursor-pointer">
          Add Skill
        </Button>
      </div>
    </div>
  );
};

export default Skills;
