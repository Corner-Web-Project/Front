import { Link } from "react-router-dom";
import type { ProjectSummary } from "../types/project";
import { projectImage } from "../api/projects";
import ProjectImage from "./ProjectImage";


interface ProjectCardProps {
  project: ProjectSummary;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Link to={`/project/${project.projectId}`}>
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#014BAA]">
    <ProjectImage
      src={project.banner ? projectImage(project.banner) : undefined}
      alt={project.title}
      className="aspect-video w-full object-cover"
      placeholder="대표 이미지 없음"
    />

    <div className="p-5">

      <div className="mb-4 flex items-center gap-3">

        <ProjectImage
          src={project.logo ? projectImage(project.logo) : undefined}
          alt={project.title}
          className="h-12 w-12 rounded-full border object-cover"
          placeholder="로고 없음"
        />

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
