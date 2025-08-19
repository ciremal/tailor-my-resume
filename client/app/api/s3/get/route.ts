import { S3 } from "@/lib/s3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Need to rewrite this to fetch from a database
export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
    });

    const response = await S3.send(command);
    const files = (response.Contents || []).map((file) => ({
      key: file.Key,
      fileName: file.Key?.split("/")[1],
      lastModified: file.LastModified,
      size: file.Size,
      etag: file.ETag,
    }));

    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not fetch files" },
      { status: 500 }
    );
  }
}
