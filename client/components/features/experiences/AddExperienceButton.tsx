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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addExperience } from "@/app/services/experiences";
import { Experiences } from "./Experiences";

export const AddExperienceButton = ({
  setExperiences,
}: {
  setExperiences: Dispatch<SetStateAction<Experiences[]>>;
}) => {
  const [skillOptions, setSkillOptions] = useState([]);

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
        setSkillOptions(
          data.map((skill: any) => {
            return {
              label: skill.name,
              value: skill.name,
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { type, name, description, skills } = values;

      const result = await addExperience(type, name, description, skills);
      setExperiences((prev) => [...prev, result]);
      toast.success("Successfully added new experience.");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Error occured with adding a new experience.");
    }
  };

  const formSchema = z.object({
    type: z.string().nonempty({
      message: "Select the type of experience.",
    }),
    name: z
      .string()
      .min(3, {
        message: "Name must be longer than 3 characters.",
      })
      .nonempty({ message: "Required field." }),
    description: z
      .string()
      .min(10, {
        message: "Description must be longer than 10 characters",
      })
      .nonempty({ message: "Required field." }),
    skills: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      name: "",
      description: "",
      skills: [],
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Experience</Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => {
          form.reset();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" id="typeInput">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of this experience</FormLabel>
                  <FormControl>
                    <Input placeholder="Company ABC..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Integrated XYZ using ABC..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => {
                const selectedSkills = form.watch("skills");

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Related Skills</FormLabel>
                    <div className="flex gap-2">
                      {selectedSkills.map((skill) => {
                        return (
                          <div
                            key={skill}
                            className="border border-primary px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            <Label>{skill}</Label>
                            <X
                              size={"1rem"}
                              className="hover:opacity-50 cursor-pointer"
                              onClick={() => {
                                const newSkills = selectedSkills.filter(
                                  (s) => s !== skill
                                );
                                form.setValue("skills", newSkills);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            Select Skill
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search framework..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {skillOptions.map((skill: any) => (
                                <CommandItem
                                  value={skill.label}
                                  key={skill.value}
                                  onSelect={() => {
                                    if (
                                      !selectedSkills.find(
                                        (s) => s === skill.value
                                      )
                                    ) {
                                      form.setValue("skills", [
                                        ...selectedSkills,
                                        skill.value,
                                      ]);
                                    }
                                  }}
                                >
                                  {skill.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button type="submit">Add Experience</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
