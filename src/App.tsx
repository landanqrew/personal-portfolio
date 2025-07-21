import { useEffect, useState } from "react";
import { APITester } from "./APITester";
import "./index.css";

import logo from "./assets/logo.svg";
import reactLogo from "./assets/react.svg";
import { syncAndFetchProjects, type Repo } from "./getProjects";

export function App() {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await syncAndFetchProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]"
        />
      </div>

      <h1 className="text-5xl font-bold my-4 leading-tight">Bun + React</h1>
      <p>
        Edit <code className="bg-[#1a1a1a] px-2 py-1 rounded font-mono">src/App.tsx</code> and save to test HMR
      </p>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && projects.length > 0 && (
        <div>
          <h2>My Projects:</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
      )}
      <APITester />
    </div>
  );
}

export default App;
