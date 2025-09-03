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

export const addSkill = async (_req: Request, res: Response) => {
  try {
    const { skill } = _req.body;
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
