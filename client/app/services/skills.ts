const API_BASE = "http://localhost:4000/api/skills";

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
}

export async function addSkill(skill: string) {
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      skill: skill,
    }),
  });
  if (!res.ok) throw new Error("Failed to add skill");
  return res.json();
}

export async function deleteSkill(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete skill");
  return res.json();
}
