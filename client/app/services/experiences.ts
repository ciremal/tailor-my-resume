const API_BASE = "http://localhost:4000/api/experiences";

export async function fetchExperiences() {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
}

export async function addExperience(
  type: string,
  name: string,
  description: string,
  skills: string[]
) {
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      name,
      description,
      skills,
    }),
  });
  if (!res.ok) throw new Error("Failed to create new experience");
  return res.json();
}

export async function deleteExperience(id: string) {
  const res = await fetch(`${API_BASE}/${id}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete experience");
  return res.json();
}

export async function deleteExperienceBulk(ids: string[]) {
  const res = await fetch(`${API_BASE}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ids,
    }),
  });
  if (!res.ok) throw new Error("Failed to delete experience(s)");
  return res.json();
}
