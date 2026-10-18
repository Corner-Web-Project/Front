import { useCallback, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import HeroSectionProject from "../components/HeroSectionProject";
import GenerationFilter from "../components/GenerationFilter";
import { getProjects } from "../api/projects";
import { useApiQuery } from "../hooks/useApiQuery";

export default function Project() {
  const [selectedGeneration, setSelectedGeneration] = useState("1기");
  return (
    <div className="mx-auto max-w-7xl p-10">
      <HeroSectionProject />
      <GenerationFilter selectedGeneration={selectedGeneration} setSelectedGeneration={setSelectedGeneration} />
      <ProjectResults key={selectedGeneration} generation={Number.parseInt(selectedGeneration, 10)} />
    </div>
  );
}

function ProjectResults({ generation }: { generation: number }) {
  const [page, setPage] = useState(0);
  const load = useCallback((signal: AbortSignal) => getProjects(generation, page, signal), [generation, page]);
  const { data, error, loading, retry } = useApiQuery(load);

  if (loading) return <p role="status" className="p-10 text-center text-gray-500">프로젝트를 불러오는 중입니다.</p>;
  if (error) return (
    <div role="alert" className="p-10 text-center">
      <p className="text-red-600">{error.message}</p>
      <button onClick={retry} className="mt-4 rounded-full bg-[#014BAA] px-5 py-2 text-white">다시 시도</button>
    </div>
  );
  if (!data || data.projects.length === 0) return <p role="status" className="p-10 text-center text-gray-500">등록된 프로젝트가 없습니다.</p>;

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        {data.projects.map((project) => <ProjectCard key={project.projectId} project={project} />)}
      </div>
      {data.totalPages > 1 && (
        <nav aria-label="프로젝트 페이지" className="mt-8 flex items-center justify-center gap-4">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-full bg-[#014BAA] px-5 py-2 text-white disabled:opacity-40">이전</button>
          <span>{page + 1} / {data.totalPages}</span>
          <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)} className="rounded-full bg-[#014BAA] px-5 py-2 text-white disabled:opacity-40">다음</button>
        </nav>
      )}
    </>
  );
}
