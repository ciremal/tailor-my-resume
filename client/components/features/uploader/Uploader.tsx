"use client";

import { Button } from "../../ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { fetchFiles } from "@/app/services/files";
import { useUploader } from "@/app/hooks/useUploader";
import { UploaderDropZone } from "./UploaderDropZone";
import { DeleteFileButton } from "./DeleteFileButton";
import { EditFileButton } from "./EditFileButton";
import { Spinner } from "@/components/ui/spinner";

export function Uploader() {
  const { files, setFiles, onDrop } = useUploader();

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
          <div
            key={file.id}
            className="flex flex-col items-center justify-center border border-primary rounded-md shadow-sm gap-2 px-4 py-12"
          >
            <p
              className={`${
                file.error ? "line-through" : ""
              } truncate text-wrap text-center`}
            >
              {file.name}
            </p>

            {file.uploading && <Spinner variant="circle" />}

            {file.error && (
              <p className="text-red-500/50">
                An error occured when trying to upload your file
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size={"icon"}
                onClick={() => file.key && downloadFile(file.key)}
                className="hover:cursor-pointer hover:bg-primary/70"
                disabled={file.uploading || file.isDeleting || !file.key}
              >
                <Download />
              </Button>

              <EditFileButton file={file} setFiles={setFiles} />

              <DeleteFileButton file={file} setFiles={setFiles} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
