import { test, expect } from "bun:test";
import { createAPI } from "./getProjects";

test("getProjects fetches repositories successfully", async () => {
  const mockRepos = [
    {
      name: "repo1",
      description: "test repo 1",
      owner: {
        login: "landanqrew"
      },
      id: 1,
      private: false,
      html_url: "https://github.com/landanqrew/repo1"
    }
  ];

  const mockFetch = async () => new Response(JSON.stringify(mockRepos));
  const api = createAPI(mockFetch);

  const repos = await api.getProjects();
  expect(Array.isArray(repos)).toBe(true);
  expect(repos[0].name).toBe("repo1");
  expect(repos[0].description).toBe("test repo 1");
});

test("getProject fetches single repository successfully", async () => {
  const mockRepo = {
    name: "test-repo",
    description: "test repository",
    owner: {
      login: "landanqrew"
    },
    id: 1,
    private: false,
    html_url: "https://github.com/landanqrew/test-repo"
  };

  const mockFetch = async () => new Response(JSON.stringify(mockRepo));
  const api = createAPI(mockFetch);

  const repo = await api.getProject("test-repo");
  expect(repo.name).toBe("test-repo");
  expect(repo.description).toBe("test repository");
}); 