import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllSkills = async (_req: Request, res: Response) => {
  try {
    const result = await prisma.skill.findMany();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const addSkill = async (req: Request, res: Response) => {
  try {
    const { skill } = req.body;
    const newSkill = await prisma.skill.create({
      data: {
        name: skill.toLowerCase(),
      },
    });
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Id is required" });
    }

    const result = await prisma.skill.delete({
      where: {
        id: id!,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
