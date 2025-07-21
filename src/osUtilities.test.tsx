import type { Repo } from "./getProjects";
import { readJsonFile, writeJsonFile, deleteFile } from "./osUtilities";
import { test, expect } from "bun:test";


test("writeJsonFile writes json file", async () => {
    const testData: Repo = {
        id: 1005872139,
        name: "goAdvent",
        description: "advent of code repo for go",
        private: false,
        html_url: "https://github.com/landanqrew/goAdvent",
        owner: {
          login: "landanqrew",
        },
        created_at: "2025-06-21T01:44:43Z",
        updated_at: "2025-07-08T17:47:00Z",
        pushed_at: "2025-07-08T17:46:57Z",
        stargazers_count: 0,
        watchers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        language: "Go",
        image: "",
    }
    let error = false;
    try {
        const data = await writeJsonFile("./src/datastore/test_projects.json", JSON.stringify(testData, null, 2));
    } catch (e) {
        console.error(e);
        error = true;
    }
    expect(error).toBe(false);
});

test("readJsonFile reads json file", async () => {
    const data = await readJsonFile("./src/datastore/test_projects.json");
    console.log("------ FILE CONTENTS ------\n", data);
    expect(data).toBeDefined();
});


test("deleteFile deletes file", async () => {
    let error = false;
    try {
        await deleteFile("./src/datastore/test_projects.json");
    } catch (e) {
        console.error(e);
        error = true;
    }
    expect(error).toBe(false);
});