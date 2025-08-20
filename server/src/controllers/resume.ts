import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllResumes = async (_req: Request, res: Response) => {
  try {
    const result = await prisma.resume.findMany();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const { name, size, key } = req.body;
    const result = await prisma.resume.create({
      data: {
        name,
        size,
        key,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const result = await prisma.resume.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
