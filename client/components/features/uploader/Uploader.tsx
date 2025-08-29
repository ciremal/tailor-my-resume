"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { fetchFiles } from "@/app/services/files";
import { useUploader } from "@/app/hooks/useUploader";
import { UploaderDropZone } from "./UploaderDropZone";
import { DeleteFileButton } from "./DeleteFileButton";
import { EditFileButton } from "./EditFileButton";
import { Spinner } from "@/components/ui/spinner";
import { DownloadFileButton } from "./DownloadFileButton";

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

  return (
    <div>
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
              <DownloadFileButton file={file} />

              <EditFileButton file={file} setFiles={setFiles} />

              <DeleteFileButton file={file} setFiles={setFiles} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
