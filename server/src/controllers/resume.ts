import { Request, Response } from "express";
import prisma from "../db/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
    const { name, size, contentType } = req.body;

    // Upload to database
    const uploadedResume = await prisma.resume.create({
      data: {
        name,
        size,
        contentType,
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
