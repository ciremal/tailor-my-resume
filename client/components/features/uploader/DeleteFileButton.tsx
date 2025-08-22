import { FileObject } from "@/app/hooks/useUploader";
import { deleteFile } from "@/app/services/files";
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface DeleteFileButtonProps {
  file: FileObject;
  setFiles: Dispatch<SetStateAction<FileObject[]>>;
}

export const DeleteFileButton = ({ file, setFiles }: DeleteFileButtonProps) => {
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={"icon"}
          className="hover:cursor-pointer hover:bg-primary/70"
          disabled={file.uploading || file.isDeleting}
        >
          {file.isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
  );
};
