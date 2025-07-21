import { readJsonFile, writeJsonFile } from "../osUtilities";
import { getProjects, type Repo, GitHubAPIError } from "../getProjects";

export async function getProjectsLocal(): Promise<Repo[]> {
  const datastorePath = './src/datastore/projects.json';
  // Check if the file exists before attempting to read
  const fileExists = await Bun.file(datastorePath).exists();
  if (!fileExists) {
    return []; // Return empty array if file doesn't exist
  }
  try {
    const parsedJson: any[] = await readJsonFile(datastorePath);
    // Ensure that mapToRepo is called only on the client side
    return parsedJson;
  } catch (error) {
    console.error("Error reading local projects file:", error);
    return [];
  }
}

export async function writeProjectsLocal(projectData: Repo[]) {
  const datastorePath = './src/datastore/projects.json';
  await writeJsonFile(datastorePath, projectData);
}

export async function updateProjectImage(projectId: number, image: string) {
  const datastorePath = './src/datastore/projects.json';
  let repos: Repo[] = await getProjectsLocal();
  let i = 0;
  for (const repo of repos) {
    if (repo.id === projectId) {
      repos[i]!.image = image;
      break;
    }
    i++;
  }
  await writeJsonFile(datastorePath, repos);
}

export async function syncAndFetchProjects(): Promise<Repo[]> {
  let gitHubProjects: Repo[] = [];
  try {
    gitHubProjects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects from GitHub. Falling back to local data.");
    return await getProjectsLocal();
  }

  const localProjects = await getProjectsLocal();

  let imageMap: Record<string, string> = {};
  for (const repo of localProjects) {
    imageMap[repo.id] = repo.image;
  }

  let i = 0;
  // update images
  for (const project of gitHubProjects) {
    if (project.id in imageMap && imageMap[project.id] !== undefined) {
      gitHubProjects[i]!.image = imageMap[project.id] || "./src/assets/questionmark.svg";
    }
    i++;
  }

  await writeProjectsLocal(gitHubProjects);
  return gitHubProjects;
} 

export async function updateProjectProperties(projectObject: {[key: string]: string | number | boolean}) {
  if (!projectObject.id) {
    throw new Error("Project ID is required");
  }
  const datastorePath = './src/datastore/projects.json';
  let repos: Repo[] = await getProjectsLocal();
  let i = 0;
  for (const repo of repos) {
    if (repo.id === projectObject.id) {
      for (const [key, value] of Object.entries(projectObject)) {
        if (repo.hasOwnProperty(key as keyof Repo)) {
          const repoKey = key as keyof Repo;
          if (typeof (repo[repoKey]) === typeof value) {
            (repos[i]![repoKey] as any) = value; // Use 'any' here for simplicity, or more precise type guards if needed
          } else if (value === null || value === undefined) {
            (repos[i]![repoKey] as any) = value; // Allow null/undefined assignments
          }
          else {
            console.warn(`Type mismatch for key ${key}: existing type ${typeof repo[repoKey]}, incoming type ${typeof value}. Value not updated.`);
          }
        }
      }
      break;
    }
    i++;
  }
  await writeJsonFile(datastorePath, repos);
}