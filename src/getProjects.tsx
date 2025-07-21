export type Repo = {
    id: number;
    name: string;
    description: string;
    private: boolean;
    html_url: string;
    owner: {
        login: string;
    };
    created_at: string;
    updated_at: string;
    pushed_at: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string;
    image: string // Needs to be manualy added or have a default image
};

// Custom error class for GitHub API errors
export class GitHubAPIError extends Error {
    constructor(
        message: string,
        public status?: number,
        public response?: any
    ) {
        super(message);
        this.name = 'GitHubAPIError';
    }
}

const mapToRepo = (data: any): Repo => ({
    id: data.id,
    name: data.name,
    description: data.description || "",
    private: data.private,
    html_url: data.html_url,
    owner: {
        login: data.owner.login
    },
    created_at: data.created_at,
    updated_at: data.updated_at,
    pushed_at: data.pushed_at,
    stargazers_count: data.stargazers_count,
    watchers_count: data.watchers_count,
    forks_count: data.forks_count,
    open_issues_count: data.open_issues_count,
    language: data.language || "",
    image: data.image || "./src/assets/questionmark.svg"
});

export const getProjects = async (): Promise<Repo[]> => {
    try {
        const response = await fetch("https://api.github.com/users/landanqrew/repos");
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new GitHubAPIError(
                `Failed to fetch repositories: ${response.statusText}`,
                response.status,
                errorData
            );
        }

        const data = await response.json();
        return data.map(mapToRepo);
    } catch (error) {
        if (error instanceof GitHubAPIError) {
            throw error;
        }
        // Handle network errors or other unexpected errors
        throw new GitHubAPIError(
            `Failed to fetch repositories: ${error instanceof Error ? error.message : 'Unknown error'}`,
            undefined,
            error
        );
    }
};
  
export const getProject = async (projectName: string): Promise<Repo> => {
    try {
        const response = await fetch(`https://api.github.com/repos/landanqrew/${projectName}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new GitHubAPIError(
                `Failed to fetch repository '${projectName}': ${response.statusText}`,
                response.status,
                errorData
            );
        }

        const data = await response.json();
        return mapToRepo(data);
    } catch (error) {
        if (error instanceof GitHubAPIError) {
            throw error;
        }
        // Handle network errors or other unexpected errors
        throw new GitHubAPIError(
            `Failed to fetch repository '${projectName}': ${error instanceof Error ? error.message : 'Unknown error'}`,
            undefined,
            error
        );
    }
};
