import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createFileMetadata, uploadToS3 } from "../services/files";
import { toast } from "sonner";
import pdfToText from "react-pdftotext";

export type FileObject = {
  id: string;
  file?: File;
  name: string;
  uploading: boolean;
  progress: number;
  key: string;
  isDeleting: boolean;
  error: boolean;
};

export function useUploader() {
  const [files, setFiles] = useState<FileObject[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: uuidv4(),
          file,
          key: uuidv4(),
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

  const uploadFile = async (file: File) => {
    try {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file
            ? {
                ...f,
                uploading: true,
              }
            : f
        )
      );

      const resumeAsText = await pdfToText(file);
      const { uploadedResume, presignedUrl } = await createFileMetadata(
        file,
        resumeAsText
      );
      await uploadToS3(presignedUrl, file);

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file
            ? {
                ...f,
                uploading: false,
                progress: 100,
                key: uploadedResume.key,
                id: uploadedResume.id,
              }
            : f
        )
      );
      toast.success("File uploaded successfully");
    } catch (error) {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file ? { ...f, uploading: false, error: true } : f
        )
      );
      toast.error("File upload failed");
    }
  };

  return { files, setFiles, onDrop };
}
