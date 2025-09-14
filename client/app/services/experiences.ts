const API_BASE = "http://localhost:4000/api/experiences";

export async function fetchExperiences() {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
}
