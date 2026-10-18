import { useParams } from "react-router-dom";
import { useCallback } from "react";
import { getProject, projectImage } from "../api/projects";
import { ApiError } from "../api/http";
import { useApiQuery } from "../hooks/useApiQuery";

export default function ProjectDetail() {
  const { id } = useParams();
  const validId = !!id && /^[1-9]\d*$/.test(id);
  const load = useCallback((signal: AbortSignal) => {
    if (!validId) throw new ApiError(404, "프로젝트를 찾을 수 없습니다.");
    return getProject(id!, signal);
  }, [id, validId]);
  const { data: project, error, loading, retry } = useApiQuery(load);

  if (loading) return <p role="status" className="p-10 text-center text-gray-500">프로젝트를 불러오는 중입니다.</p>;
  if (error && !(error instanceof ApiError && error.status === 404)) return (
    <div role="alert" className="p-10 text-center">
      <p className="text-red-600">{error.message}</p>
      <button onClick={retry} className="mt-4 rounded-full bg-[#014BAA] px-5 py-2 text-white">다시 시도</button>
    </div>
  );

  if (!project) {
    return (
      <h1 className="p-10 text-center text-2xl font-bold">
        프로젝트를 찾을 수 없습니다.
      </h1>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-10">

      {/* 프로젝트 제목 */}
      <div className="mb-10">

        <span className="rounded-full bg-[#014BAA] px-4 py-2 text-sm font-bold text-white">
          {project.generation}기
        </span>

        <h1 className="mt-5 text-5xl font-bold text-[#014BAA]">
          {project.title}
        </h1>

        <p className="mt-3 text-xl text-gray-500">
          {project.subtitle}
        </p>

      </div>

      {/* 대표 배너 */}
      {project.banner ? <img
        src={projectImage(project.banner)}
        alt={project.title}
        className="mb-10 h-[350px] w-full rounded-2xl object-cover shadow-lg"
      /> : <div aria-label="대표 이미지 없음" className="mb-10 h-[350px] w-full rounded-2xl bg-gray-100 shadow-lg" />}

      

      {/* 프로젝트 설명 */}
      <div className="rounded-2xl border p-6 shadow-sm">

        <h2 className="mb-4 text-2xl font-bold text-[#014BAA]">
          프로젝트 설명
        </h2>

        <p className="leading-8 text-gray-700">
          {project.description}
        </p>

      </div>

      {/* 팀원 */}
      <div className="mt-8 rounded-2xl border p-6 shadow-sm">

        <h2 className="mb-5 text-2xl font-bold text-[#014BAA]">
          프로젝트 팀원
        </h2>

        {project.members.length === 0 ? (

          <p className="text-gray-400">
            등록된 팀원이 없습니다.
          </p>

        ) : (

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            {project.members.map((member, index) => (

              <div
                key={index}
                className="rounded-xl bg-[#014BAA] p-4 text-center text-white transition hover:scale-105"
              >

                <p className="text-sm">
                  {member.role}
                </p>

                <p className="mt-2 text-lg font-bold">
                  {member.name}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
