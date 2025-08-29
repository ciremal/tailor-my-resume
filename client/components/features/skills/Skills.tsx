"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useRef, useState } from "react";

const Skills = () => {
  const [skills, setSkills] = useState<string[]>([
    "Python",
    "JavaScript",
    "Node",
  ]);

  const [input, setInput] = useState("");

  const addSkill = () => {
    if (!input) {
      return;
    }

    const skill = skills.find((s) => s.toLowerCase() === input.toLowerCase());
    if (!skill) {
      setSkills((prev) => [...prev, input]);
    }
    setInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 border border-primary px-6 py-4">
        {skills.map((skill) => {
          return (
            <div
              key={skill}
              className="border-2 border-primary px-2 py-1 rounded-md flex items-center gap-1"
            >
              <Label>{skill}</Label>
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
        <Button onClick={() => addSkill()} className="cursor-pointer">
          Add Skill
        </Button>
      </div>
    </div>
  );
};

export default Skills;
