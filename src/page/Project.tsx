import { useState } from "react";

import { Project, Member } from "../types/project";

// import GenerationSelect from "../components/GenerationSelect";
// import ProjectInfo from "../components/ProjectInfo";
// import ImageUpload from "../components/ImageUpload";
// import Description from "../components/Description";
// import MemberList from "../components/MemberList";
// import SubmitButton from "../components/SubmitButton";

export default function Project() {
  const [project, setProject] = useState<Project>({
    generation: "1기",
    title: "",
    subtitle: "",
    description: "",
    logo: null,
    banner: null,
  });

  const [members, setMembers] = useState<Member[]>([
    {
      role: "",
      name: "",
    },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !project.title.trim() ||
      !project.subtitle.trim() ||
      !project.description.trim()
    ) {
      alert("필수 입력 항목을 작성해주세요.");
      return;
    }

    if (members.some((member) => !member.role.trim() || !member.name.trim())) {
      alert("팀원 정보를 모두 입력해주세요.");
      return;
    }

    console.log(project);
    console.log(members);

    alert("등록 완료");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-2xl border bg-white p-10 shadow-lg"
      >
        <GenerationSelect
          generation={project.generation}
          setProject={setProject}
        />

        <ProjectInfo
          project={project}
          setProject={setProject}
        />

        <ImageUpload
          project={project}
          setProject={setProject}
        />

        <Description
          project={project}
          setProject={setProject}
        />

        <MemberList
          members={members}
          setMembers={setMembers}
        />

        <SubmitButton />
      </form>
    </div>
  );
}
