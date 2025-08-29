import { FileObject } from "@/app/hooks/useUploader";
import { renameFile } from "@/app/services/files";
import { Button } from "@/components/ui/button";
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
import { Label } from "@radix-ui/react-dropdown-menu";
import { Edit } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";

interface EditFileButtonProps {
  file: FileObject;
  setFiles: Dispatch<SetStateAction<FileObject[]>>;
}

export const EditFileButton = ({ file, setFiles }: EditFileButtonProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  async function handleEditFileSave(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    try {
      const fileId: string = file.id;
      await renameFile(fileId, inputValue);
      setFiles((prevFiles: FileObject[]) =>
        prevFiles.map((f: FileObject) =>
          f.id === fileId ? { ...f, name: inputValue } : f
        )
      );
      setOpenEditDialog(false);
      toast.success("Successfully updated file name.");
    } catch (error: unknown) {
      console.error(error);
      toast.error("An error occured updating the file name.");
    }
  }

  return (
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

        <form onSubmit={handleEditFileSave}>
          <div className="flex flex-col gap-2">
            <Label>File Name</Label>
            <Input
              placeholder={file.name}
              onChange={(e) => setInputValue(e.target.value)}
            />
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
  );
};
