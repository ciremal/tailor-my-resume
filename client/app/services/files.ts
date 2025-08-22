const API_BASE = "http://localhost:4000/api/resumes";

export async function createFileMetadata(file: File, pdfAsText: string) {
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type,
      pdfAsText: pdfAsText.trim(),
    }),
  });
  if (!res.ok) throw new Error("Failed to create file metadata");
  return res.json();
}

export async function uploadToS3(presignedUrl: string, file: File) {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("S3 upload failed");
}

export async function deleteFile(id: string, key: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  if (!res.ok) throw new Error("Failed to delete file");
}

export async function fetchFiles() {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
}

export async function renameFile(id: string, newName: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error("Failed to rename file");
}

export async function downloadResume(key: string) {
  const res = await fetch(`${API_BASE}/download/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to get download link");
  return res.json();
}
