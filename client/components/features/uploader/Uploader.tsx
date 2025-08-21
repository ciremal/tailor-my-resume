"use client";

import { Button } from "../../ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
import { deleteFile, fetchFiles, renameFile } from "@/app/services/files";
import { useUploader } from "@/app/hooks/useUploader";
import { UploaderDropZone } from "./UploaderDropZone";

export function Uploader() {
  const { files, setFiles, onDrop } = useUploader();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const inputNewNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const files = await fetchFiles();
        setFiles(
          files.map((file: any) => ({
            id: file.id,
            name: file.name,
            key: file.key,
            uploading: false,
            progress: 100,
            isDeleting: false,
            error: false,
          }))
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch files.");
      }
    };
    fetchData();
  }, []);

  async function handleDeleteFile(fileId: string, fileKey: string) {
    try {
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === fileId ? { ...f, isDeleting: true } : f))
      );

      await deleteFile(fileId, fileKey);

      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
      toast.success("File successfully deleted");
    } catch (error) {
      toast.error("Failed to delete file.");
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileId ? { ...f, isDeleting: false, error: true } : f
        )
      );
    }
  }

  async function handleEditFileSave(fileId: string, newName: string) {
    try {
      await renameFile(fileId, newName);
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === fileId ? { ...f, name: newName } : f))
      );
      setOpenEditDialog(false);
      toast.success("Successfully updated file name.");
    } catch (error) {
      console.error(error);
      toast.error("An error occured updating the file name.");
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

  return (
    <>
      <UploaderDropZone onDrop={onDrop} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mt-6">
        {files.map((file) => (
          <div key={file.id}>
            <p className={`${file.error ? "line-through" : ""} truncate`}>
              {file.name}
            </p>

            {file.error && (
              <p className="text-red-500/50">
                An error occured when trying to upload your file
              </p>
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
                    <AlertDialogAction
                      onClick={() => handleDeleteFile(file.id, file.key)}
                    >
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

              <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
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
                      const newName = inputNewNameRef.current?.value;
                      if (newName) {
                        handleEditFileSave(file.id, newName);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <Label>File Name</Label>
                      <Input ref={inputNewNameRef} placeholder={file.name} />
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
