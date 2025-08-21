import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface UploaderDropZoneProps {
  onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
}

export const UploaderDropZone = ({ onDrop }: UploaderDropZoneProps) => {
  const rejectedFiles = useCallback((fileRejection: FileRejection[]) => {
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

  return (
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
  );
};
