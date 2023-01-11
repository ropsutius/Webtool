import axios from "axios";
const baseUrl = "http://localhost:3000/projects/";

export async function getSavedProjects() {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function addSavedProject(matrix) {
  try {
    const response = await axios.post(baseUrl, matrix);
    return response.data;
  } catch {
    return undefined;
  }
}

export async function getSavedProjectById(id) {
  try {
    const response = await axios.get(baseUrl + id);
    return response.data;
  } catch {
    return undefined;
  }
}
