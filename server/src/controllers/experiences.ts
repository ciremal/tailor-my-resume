import { Request, Response } from "express";
import prisma from "../db/client";

export const getExperiences = async (_req: Request, res: Response) => {
  try {
    const result = await prisma.experience.findMany({
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const addExperience = async (req: Request, res: Response) => {
  try {
    const { type, name, description, skills } = req.body;

    if (!type || !name || !description || !Array.isArray(skills)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const newExperience = await prisma.experience.create({
      data: {
        type,
        name,
        description,
        skills: {
          create: skills.map((skillName: string) => ({
            skill: {
              connectOrCreate: {
                where: { name: skillName.toLowerCase() },
                create: { name: skillName.toLowerCase() },
              },
            },
          })),
        },
      },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
