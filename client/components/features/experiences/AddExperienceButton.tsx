"use client";

import { fetchSkills } from "@/app/services/skills";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skill } from "@/lib/types";
import { useEffect, useState } from "react";
import { SkillSelect } from "./SkillSelect";
import { X } from "lucide-react";

export const AddExperienceButton = () => {
  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);

  const [skillOptions, setSkillOptions] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSkills();
        data.sort((a: any, b: any) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        setSkillOptions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSetSkills = (skill: string) => {
    if (skills.find((s) => s === skill)) {
      return;
    }
    setSkills((prev) => [...prev, skill]);
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add Experience</Button>
        </DialogTrigger>
        <DialogContent
          onCloseAutoFocus={() => {
            setType("");
            setName("");
            setDescription("");
            setSkills([]);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="typeInput">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full" id="typeInput">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type && (
              <>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="nameInput">
                    Name of the {type} experience
                  </Label>
                  <Input
                    id="nameInput"
                    placeholder="Company ABC..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="descriptionInput">
                    Description of the experience
                  </Label>
                  <Textarea
                    id="descriptionInput"
                    placeholder="Integrated XYZ using ABC..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="descriptionInput">Related skills</Label>
                  <div className="flex gap-2">
                    {skills.map((skill) => {
                      return (
                        <div
                          key={skill}
                          className="border border-primary px-2 py-1 rounded-md flex items-center gap-1"
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
                  <SkillSelect
                    options={skillOptions.map((s) => ({
                      value: s.name,
                      label: s.name,
                    }))}
                    handleSetSkills={handleSetSkills}
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
