import { Link } from "react-router-dom";
import type { ProjectSummary } from "../types/project";
import { projectImage } from "../api/projects";


interface ProjectCardProps {
  project: ProjectSummary;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Link to={`/project/${project.projectId}`}>
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#014BAA]">
    {project.banner ? <img
      src={projectImage(project.banner)}
      alt={project.title}
      className="aspect-video w-full object-cover"
    /> : <div aria-label="대표 이미지 없음" className="aspect-video w-full bg-gray-100" />}

    <div className="p-5">

      <div className="mb-4 flex items-center gap-3">

        {project.logo ? <img
          src={projectImage(project.logo)}
          alt={project.title}
          className="h-12 w-12 rounded-full border object-cover"
        /> : <div aria-label="로고 없음" className="h-12 w-12 rounded-full border bg-gray-100" />}

        <div>

          <h2 className="text-2xl font-bold text-[#014BAA]">
            {project.title}
          </h2>

          <p className="mt-1 text-gray-500">
            {project.subtitle}
          </p>

        </div>

      </div>

      <span className="rounded-full bg-[#014BAA] px-3 py-1 text-sm font-bold text-white">
        {project.generation}기
      </span>

    </div>

  </div>
</Link>
  );
}
