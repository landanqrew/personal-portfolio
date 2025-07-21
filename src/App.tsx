import { useEffect, useState } from "react";
import { APITester } from "./APITester";
import "./index.css";

import logo from "./assets/logo.svg";
import reactLogo from "./assets/react.svg";
import { type Repo } from "./getProjects";
import { CardView } from "./cardView";
import { type CardButtonProps } from "./cardButton";
import { EyeIcon } from "./EyeIcon";
import { DetailView, type DetailViewField, type DetailViewSection } from "./detailView";

export function App() {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Repo | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call the new API endpoint
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedProjects: Repo[] = await response.json();
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

  const handleCardClick = (project: Repo) => {
    console.log(`Card clicked: ${project.name}`);
    setSelectedProject(project);
  };

  const handleProjectUpdate = (updateObject: {[key: string]: string | number | boolean}) => {
    fetch("/api/projects/update", {
      method: "PUT",
      body: JSON.stringify(updateObject),
    });
  }

  const viewProjectOnGitHub = (url: string) => {
    window.open(url, "_blank");
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((project) => {
            const cardButtons: CardButtonProps[] = [
              {
                label: "View on GitHub",
                icon: <EyeIcon />,
                onClick: (e) => {
                  e.stopPropagation(); // Prevent card onClick from firing
                  viewProjectOnGitHub(project.html_url);
                },
              },
              // Add more buttons as needed
            ];

            return (
              <CardView
                key={project.id}
                image={project.image}
                name={project.name}
                description={project.description}
                buttons={cardButtons}
                onClick={() => handleCardClick(project)}
              />
            );
          })}
        </div>
      )}
      {selectedProject && (
        <DetailView
          headerSection={{
            sectionHeaders: [
              {
                fieldName: "Project Name",
                fieldValue: selectedProject.name,
                isEditable: false,
                htmlTag: "h1",
                buttons: [],
                cssClass: "text-5xl font-bold my-4 leading-tight"
              }
            ],
            fields: [
              {
                fieldName: "Project Description",
                fieldValue: selectedProject.description,
                isEditable: false,
                htmlTag: "p",
                buttons: [],
                cssClass: "text-lg text-gray-400"
              }
            ]
          }}
          headerButtons={[
            {
              label: "Back to Projects",
              onClick: () => setSelectedProject(null),
              icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
            },
            {
              label: "View on GitHub",
              icon: <EyeIcon />,
              onClick: (e) => {
                e.stopPropagation();
                viewProjectOnGitHub(selectedProject.html_url);
              }
            }
          ]}
          sections={[
            {
              sectionHeaders: [],
              fields: Object.entries(selectedProject).map(([key, value]) => {
                if (key === "insights") {
                  return {
                    fieldName: key,
                    fieldValue: value.toString(),
                    isEditable: true,
                    htmlTag: "p",
                    buttons: [],
                    onChange: (e: any) => {
                      handleProjectUpdate({
                        id: selectedProject.id,
                        [key]: e.target.value
                      });
                    }
                  }
                }
                return {
                  fieldName: key,
                  fieldValue: value.toString(),
                  isEditable: false,
                  htmlTag: "p",
                  buttons: [],
                }
              }),
            }
          ]}
        />
      )}
      {!selectedProject && <APITester />}
    </div>
  );
}

export default App;
