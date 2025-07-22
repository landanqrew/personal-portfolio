import { useEffect, useState } from "react";
import { APITester } from "./APITester";
import "./index.css";

import {
    logo,
    reactLogo,
    golangLogo,
    pythonLogo,
    typescriptLogo,
    javascriptLogo,
    questionmarkLogo,
    LogoMap,
} from "./assets";

import { type Repo } from "./getProjects";
import { CardView } from "./cardView";
import { type CardButtonProps } from "./cardButton";
import { EyeIcon } from "./EyeIcon";
import { DetailView, type DetailViewField, type DetailViewSection } from "./detailView";
import React from "react";

export function App() {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Repo | null>(null);

  // Track renders without causing infinite loop
  const currentRenderCount = React.useRef(0);
  currentRenderCount.current += 1;

  console.log('App component rendering, renderCount:', currentRenderCount.current, 'selectedProject:', selectedProject);

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
    console.log('Setting selectedProject to:', project);
    setSelectedProject(project);
  };

  // Add this debug log to see when selectedProject changes
  useEffect(() => {
    console.log('selectedProject state changed to:', selectedProject);
  }, [selectedProject]);

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
      <div className="flex flex-col items-center justify-center pt-4 pb-2">
        <h1 className="text-4xl text-[#fbf0df] font-mono font-bold my-4 leading-tight">Creating Robust Software Solutions</h1>
        <code className="text-lg text-[#fbf0df]/70">Landan Quartemont </code>
      </div>
      <div className="flex justify-center items-center gap-8 pt-4">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]"
        />
        <img
          src={golangLogo}
          alt="Golang Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#00ACD7aa] scale-200"
        />
        <img
          src={pythonLogo}
          alt="Python Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#FFDA4Baa] scale-120"
        />
        <img
          src={typescriptLogo}
          alt="TypeScript Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#3178C6aa] scale-120"
        />
      </div>
      <div className="flex flex-col grid-cols-2 items-center justify-center pt-4 ps-4">
        <div className="flex flex-col items-center justify-center pt-4">
          <code className="text-sm text-[#fbf0df]/80 mb-2 font-mono bg-[#2a2a2a] px-3 py-2 pb-2 rounded border-l-4 border-[#fbf0df]/30 text-left">
          From the desolate and constrained lands of No-Code, I am venturing into the world of native development. I've worked in the industry since 2019 and have worked primarily on
          intra-organizational software solutions from operations. From field service applications to CRM systems, I've created scalable, light-weight solutions that solve business
          critical problems. 
          <br />
          <br />
          In my extended time working in no-code, I have developed a strong understanding of system design and architecture. I've worked on projects that have required me to 
          extend application functionality through various dialects of SQL, JavaScript, and Python. Early 2024, I began a more formal education in software development, and have been 
          working on projects in Go, Python, and TypeScript ever since. Checkout my <a href="https://github.com/landanqrew" target="_blank" rel="noopener noreferrer">GitHub </a>  
          for more details.
          </code>
        </div>
      </div>
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && projects.length > 0 && (
        <div className="relative mt-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const container = document.getElementById('projects-carousel');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="bg-[#fbf0df] text-[#1a1a1a] border-0 p-3 rounded-full font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer z-10"
              aria-label="Previous projects"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <div 
              id="projects-carousel"
              className="flex-1 overflow-x-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className="flex gap-6 pb-4 py-4" style={{ width: 'max-content' }}>
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
                    <div key={project.id} className="flex-shrink-0 w-80 ps-4">
                      <CardView
                        image={LogoMap[project.language as keyof typeof LogoMap] || LogoMap["Logo"]}
                        name={project.name}
                        description={project.description}
                        buttons={cardButtons}
                        onClick={() => handleCardClick(project)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button 
              onClick={() => {
                const container = document.getElementById('projects-carousel');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="bg-[#fbf0df] text-[#1a1a1a] border-0 p-3 rounded-full font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer z-10"
              aria-label="Next projects"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {selectedProject && (
        <DetailView
            headerSection={{
              sectionHeaders: [],
              fields: [
                {
                  fieldName: "",
                  fieldValue: selectedProject.name,
                  isEditable: false,
                  htmlTag: "h1",
                  buttons: [],
                  cssClass: "text-3xl font-mono font-bold text-[#fbf0df] mb-2"
                },
                {
                  fieldName: "",
                  fieldValue: selectedProject.description || "No description available",
                  isEditable: false,
                  htmlTag: "p",
                  buttons: [],
                  cssClass: "text-lg text-[#fbf0df]/80 mb-2 font-mono bg-[#2a2a2a] px-3 py-2 rounded border-l-4 border-[#fbf0df]/30"
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
                  e?.stopPropagation();
                  viewProjectOnGitHub(selectedProject.html_url);
                }
              }
            ]}
            sections={[
              {
                sectionHeaders: [
                  {
                    fieldName: "",
                    fieldValue: "Repository Details",
                    isEditable: false,
                    htmlTag: "h2",
                    buttons: [],
                    cssClass: "text-xl font-mono font-semibold text-[#fbf0df] mb-3"
                  }
                ],
                fields: [
                  {
                    fieldName: "Language",
                    fieldValue: selectedProject.language || "Not specified",
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  },
                  {
                    fieldName: "Stars",
                    fieldValue: selectedProject.stargazers_count.toString(),
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  },
                  {
                    fieldName: "Forks",
                    fieldValue: selectedProject.forks_count.toString(),
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  },
                  {
                    fieldName: "Open Issues",
                    fieldValue: selectedProject.open_issues_count.toString(),
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  }
                ]
              },
              {
                sectionHeaders: [
                  {
                    fieldName: "",
                    fieldValue: "Timeline",
                    isEditable: false,
                    htmlTag: "h2",
                    buttons: [],
                    cssClass: "text-xl font-semibold text-[#fbf0df] mb-3"
                  }
                ],
                fields: [
                  {
                    fieldName: "Created",
                    fieldValue: new Date(selectedProject.created_at).toLocaleDateString(),
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  },
                  {
                    fieldName: "Last Updated",
                    fieldValue: new Date(selectedProject.updated_at).toLocaleDateString(),
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  },
                  {
                    fieldName: "Last Push",
                    fieldValue: new Date(selectedProject.pushed_at).toLocaleDateString(),
                    isEditable: false,
                    htmlTag: "p",
                    buttons: [],
                    cssClass: "text-[#fbf0df]/70 font-mono"
                  }
                ]
              }
            ]}
          />
        )}
      {!selectedProject}
    </div>
  );
}

export default App;
