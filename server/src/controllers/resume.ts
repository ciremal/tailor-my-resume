import { Request, Response } from "express";
import prisma from "../db/client";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../lib/s3Client";

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
    const { name, size, contentType, pdfAsText } = req.body;

    // Upload to database
    const uploadedResume = await prisma.resume.create({
      data: {
        name,
        size,
        contentType,
        pdfAsText,
      },
    });

    const { key } = uploadedResume;

    // Get presigned URL for S3 bucket
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    const response = {
      uploadedResume,
      presignedUrl,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key } = req.body;

    if (!key) {
      res.status(400).json({ error: "Key is required" });
    }
    if (!id) {
      res.status(400).json({ error: "Id is required" });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    await S3.send(command);

    const result = await prisma.resume.delete({
      where: {
        id: id!,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateResumeName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ error: "New name is required" });
    }
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const result = await prisma.resume.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const downloadResume = async (req: Request, res: Response) => {
  try {
    const key = decodeURIComponent(req.params.key as string);

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 300,
    });

    res.status(200).json({ url: presignedUrl });
  } catch (error) {
    res.status(500).json(error);
  }
};
