"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Download, Edit, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FileObject = {
  id: string; // unique id
  file?: File; // the file itself
  name: string;
  uploading: boolean; // is the file currently uploading
  progress: number; // upload progress in percentage
  key?: string; // key of the file in the storage
  isDeleting: boolean; // is the file currently being deleted
  error: boolean; // has the file upload failed
};

export function Uploader() {
  const [files, setFiles] = useState<Array<FileObject>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const files = await getAllFiles();
      setFiles(
        files.map((file: any) => ({
          id: uuidv4(),
          name: file.fileName,
          key: file.key,
          uploading: false,
          progress: 100,
          isDeleting: false,
          error: false,
        }))
      );
    };
    fetchData();
  }, []);

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
          name: file.name,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
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

  async function deleteFile(fileId: string) {
    try {
      const fileToRemove = files.find((f) => f.id === fileId);

      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === fileId ? { ...f, isDeleting: true } : f))
      );

      const deleteFileResponse = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileToRemove?.key,
        }),
      });

      if (!deleteFileResponse.ok) {
        toast.error("Failed to delete file");
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileId ? { ...f, isDeleting: false, error: true } : f
          )
        );
        return;
      }

      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
      toast.success("File successfully deleted");
    } catch (error) {
      toast.error("Failed to delete file");
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileId ? { ...f, isDeleting: false, error: true } : f
        )
      );
    }
  }

  async function downloadFile(fileKey: string) {
    try {
      const response = await fetch(
        `/api/s3/download-file?key=${encodeURIComponent(fileKey)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        toast.error("Could not download resume right now.");
        return;
      }

      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      toast.error("Could not download resume right now.");
    }
  }

  async function getAllFiles() {
    try {
      const response = await fetch("/api/s3/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Error occured in fetching resumes");
        return;
      }

      const files = await response.json();
      return files;
    } catch (error) {
      console.error(error);
      toast.error("Error occured in fetching resumes");
    }
  }

  async function editFile(fileKey: string) {
    console.log(fileKey);
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
            <p className={`${file.error ? "line-through" : ""} truncate`}>
              {file.name}
            </p>

            {file.error ? (
              <p className="text-red-500/50">
                An error occured when trying to upload your file
              </p>
            ) : (
              <p>{file.progress}%</p>
            )}
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size={"icon"}
                    className="hover:cursor-pointer hover:bg-primary/70"
                    disabled={file.uploading || file.isDeleting}
                  >
                    {file.isDeleting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {`This action cannot be undone. This will permanently delete
                      ${file.name} and it's data.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteFile(file.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                size={"icon"}
                onClick={() => file.key && downloadFile(file.key)}
                className="hover:cursor-pointer hover:bg-primary/70"
                disabled={file.uploading || file.isDeleting || !file.key}
              >
                <Download />
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="hover:cursor-pointer hover:bg-primary/70"
                    disabled={file.uploading || file.isDeleting || !file.key}
                  >
                    <Edit />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit File Name</DialogTitle>
                    <DialogDescription>
                      Make changes to your file name here.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (file.key) editFile(file.key);
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <Label>File Name</Label>
                      <Input placeholder={file.name} />
                    </div>

                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
