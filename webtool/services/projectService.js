const baseUrl = 'http://localhost:3000/projects/';

export async function getSavedProjects() {
  const response = await axios.get(baseUrl);
  return response.data;
}

export async function addSavedProject(matrix) {
  const response = await axios.post(baseUrl, matrix);
  return response.data;
}

export async function getSavedProjectById(id) {
  const response = await axios.get(baseUrl + id);
  return response.data;
}
