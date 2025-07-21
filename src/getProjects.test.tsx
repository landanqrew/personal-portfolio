import { test, expect } from "bun:test";
import { getProjects, getProject, writeProjectsLocal, getProjectsLocal } from "./getProjects";

test("getProjects fetches repositories successfully", async () => {
  const expectedRepoNames = ["simple-jot", "py_asteroids", "goAdvent"];

  const repos = await getProjects();
  // const reposParsed = JSON.parse(repos);
  //console.log("----- REPOS -----\n", repos);
  expect(Array.isArray(repos)).toBe(true);
  for (const expectedRepoName of expectedRepoNames) {
    expect(expectedRepoName).toBeOneOf(repos.map((e: any) => e.name))
  }
});

test("getProject fetches single repository successfully", async () => {
  const expectedRepoNames = ["simple-jot", "py_asteroids", "goAdvent"];

  for (const expectedRepoName of expectedRepoNames) {
    const repo = await getProject(expectedRepoName);
    // console.log("----- REPO -----\n", repo);
    expect(repo.name).toBe(expectedRepoName);
  }
}); 

test("writeProjectsLocal writes projects to local storage", async () => {
  let error = false;
  try {
    const repos = await getProjects();
    console.log("----- REPOS: -----\n", repos.length);
    await writeProjectsLocal(repos);
    /*const reposLocal = await getProjectsLocal();
    expect(reposLocal).toEqual(repos);*/
  } catch (error) {
    console.error(error);
    error = true;
  }
  expect(error).toBe(false);
});