import ProjectCard from "../components/ProjectCard";
import { projectData } from "../data/projectData";

export default function Project() {
  return (
    <div className="mx-auto max-w-7xl p-10">

      <h1 className="mb-10 text-4xl font-bold text-[#014BAA]">
        PROJECT
      </h1>

      <div className="grid grid-cols-2 gap-8">

        {projectData.map((project) => (

          <ProjectCard
            key={project.id}
            project={project}
          />

        ))}

      </div>

    </div>
  );
}