import { FileObject } from "@/app/hooks/useUploader";
import { downloadResume } from "@/app/services/files";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface DownloadFileButtonProps {
  file: FileObject;
}

export const DownloadFileButton = ({ file }: DownloadFileButtonProps) => {
  async function downloadFile(fileKey: string) {
    try {
      const downloadUrl = await downloadResume(fileKey);
      const { url } = downloadUrl;
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      toast.error("Could not download resume right now.");
    }
  }

  return (
    <Button
      size={"icon"}
      onClick={() => file.key && downloadFile(file.key)}
      className="hover:cursor-pointer hover:bg-primary/70"
      disabled={file.uploading || file.isDeleting || !file.key}
    >
      <Download />
    </Button>
  );
};
