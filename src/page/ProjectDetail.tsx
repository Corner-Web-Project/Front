import { useParams } from "react-router-dom";
import { projectData } from "../data/projectData";

export default function ProjectDetail() {

  const { id } = useParams();

  const project = projectData.find(
    (item) => item.id === Number(id)
  );

  if (!project) {
    return <h1>프로젝트를 찾을 수 없습니다.</h1>;
  }

  return (
    <div className="mx-auto max-w-5xl p-10">

      <img
        src={project.banner}
        className="mb-8 h-[350px] w-full rounded-2xl object-cover"
      />

      <div className="mb-8 flex items-center gap-5">

        <img
          src={project.logo}
          className="h-20 w-20 rounded-xl border"
        />

        <div>

          <h1 className="text-4xl font-bold text-[#014BAA]">
            {project.title}
          </h1>

          <p className="text-gray-500">
            {project.subtitle}
          </p>

        </div>

      </div>

      <div className="rounded-2xl border p-6">

        <h2 className="mb-3 text-2xl font-bold">
          프로젝트 설명
        </h2>

        <p>
          {project.description}
        </p>

      </div>

      <div className="mt-8 rounded-2xl border p-6">

        <h2 className="mb-5 text-2xl font-bold">
          프로젝트 팀원
        </h2>

        <div className="grid grid-cols-4 gap-4">

          {project.members.map((member, index) => (

            <div
              key={index}
              className="rounded-xl bg-[#014BAA] p-4 text-center text-white"
            >

              <p>{member.role}</p>

              <p className="font-bold">
                {member.name}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}