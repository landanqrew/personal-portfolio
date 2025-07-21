import { fetch } from "bun";

type FetchLike = (input: string) => Promise<{ json: () => Promise<any> }>;

// Allow injection of custom fetch for testing
export const createAPI = (customFetch: FetchLike = fetch) => ({
  getProjects: async () => {
    const response = await customFetch("https://api.github.com/users/landanqrew/repos");
    return response.json();
  },
  
  getProject: async (projectName: string) => {
    const response = await customFetch(`https://api.github.com/repos/landanqrew/${projectName}`);
    return response.json();
  }
});

// Export default instances using Bun's fetch
export const { getProjects, getProject } = createAPI();