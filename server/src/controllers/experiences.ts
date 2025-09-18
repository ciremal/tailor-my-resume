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
    const simplifiedResult = result.map((experience) => ({
      ...experience,
      skills: experience.skills.map((s) => ({
        id: s.skill.id,
        name: s.skill.name,
      })),
    }));

    res.status(200).json(simplifiedResult);
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

    const result = await prisma.experience.create({
      data: {
        type: type.toUpperCase(),
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

    const newExperience = {
      ...result,
      skills: result.skills.map((s) => ({
        id: s.skill.id,
        name: s.skill.name,
      })),
    };

    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await prisma.experience.delete({
      where: {
        id: id!,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteMultipleExperiences = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids must be a non-empty list" });
    }

    const result = await prisma.experience.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    res
      .status(200)
      .json({ message: `Deleted ${result.count} experience(s) successfully` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
