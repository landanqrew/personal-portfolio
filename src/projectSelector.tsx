import { useEffect, useRef, useState } from "react";
import { getProjects, getProject } from "./getProjects";

export const ProjectSelector = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const projectResponseRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handleProjectSelect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectName = projectResponseRef.current?.value;
    if (!projectName) return;
    const projectDetails = await getProject(projectName);
    setSelectedProject(projectDetails);
  };
  return (
    <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
      <form
        onSubmit={handleProjectSelect}
        className="flex items-center gap-2 bg-[#1a1a1a] p-3 rounded-xl font-mono border-2 border-[#fbf0df] transition-colors duration-300 focus-within:border-[#f3d5a3] w-full"
      >
        <select
          onChange={(e) => {
            projectResponseRef.current!.value = e.target.value;
          }}
        >
            {projects.map((project) => (
            <option key={project.id} value={project.name}>{project.name}</option>
            ))}
        </select>
        <button
          type="submit"
          className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap"
        >
          Get Details
        </button>
      </form>
      <h3 className="text-lg font-bold">{selectedProject?.name}</h3>
    </div>
  )
};