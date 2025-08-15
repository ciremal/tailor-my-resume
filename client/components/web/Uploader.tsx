"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type FileObject = {
  id: string; // unique id
  file: File; // the file itself
  uploading: boolean; // is the file currently uploading
  progress: number; // upload progress in percentage
  key?: string; // key of the file in the storage
  isDeleting: boolean; // is the file currently being deleted
  error: boolean; // has the file upload failed
  objectUrl?: string; // the object url of the file
};

export function Uploader() {
  const [files, setFiles] = useState<Array<FileObject>>([]);

  const fileError = (file: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.file === file ? { ...f, uploading: false, error: true } : f
      )
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: uuidv4(),
          file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        })),
      ]);
    }

    acceptedFiles.forEach((file) => uploadFile(file));
  }, []);

  const rejectedFiles = useCallback((fileRejection: FileRejection[]) => {
    console.log(fileRejection);
    if (fileRejection.length) {
      const toomanyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizetoBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      const invalidFile = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-invalid-type"
      );

      if (toomanyFiles) {
        toast.error("Please upload only 1 file.");
      }

      if (fileSizetoBig) {
        toast.error("File size exceeds 2MB limit.");
      }

      if (invalidFile) {
        toast.error("Please upload a PDF file.");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectedFiles,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  async function uploadFile(file: File) {
    // Mark file as uploading
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f))
    );

    try {
      // request presigned url
      const presignedUrlRes = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!presignedUrlRes.ok) {
        toast.error("Failed to get presigned URL");
        fileError(file);
        return;
      }

      const { presignedUrl, key } = await presignedUrlRes.json();

      // Upload file to S3 using presigned URL
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        toast.error("Upload failed");
        fileError(file);
        return;
      }

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file ? { ...f, uploading: false, progress: 100, key } : f
        )
      );

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      fileError(file);
      toast.error("File upload failed");
    }
  }

  return (
    <>
      <Card
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
          isDragActive
            ? "border-primary bg-secondary/10 border-solid"
            : "border-border hover:border-primary"
        )}
      >
        <CardContent className="flex items-center justify-center h-full w-full">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center">Drop the files here ...</p>
          ) : (
            <div className="flex flex-col items-center gap-y-3">
              <p>Drag 'n' drop some files here, or click to select files</p>
              <Button>Select Files</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mt-6">
        {files.map((file) => (
          <div key={file.id}>
            <p className={`${file.error ? "line-through" : ""}`}>
              {file.file.name}
            </p>

            {file.error ? (
              <p className="text-red-500/50">
                An error occured when trying to upload your file
              </p>
            ) : (
              <p>{file.progress}%</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
