import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Projectup, Member } from "../types/projectup";
import { useAuth } from "../context/auth";
import { createProject, uploadProjectImage } from "../api/projects";
import GenerationSelect from "../components/GenerationSelect";
import ProjectupInfo from "../components/ProjectupInfo";
import ImageUpload from "../components/ImageUpload";
import Description from "../components/Description";
import MemberList from "../components/MemberList";
import SubmitButton from "../components/SubmitButton";

export default function Projectup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectup, setProjectup] = useState<Projectup>({
    generation: "1기", title: "", subtitle: "", description: "", logo: null, banner: null,
  });
  const [members, setMembers] = useState<Member[]>([{ role: "", name: "" }]);
  const [stacks, setStacks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  // Reuse successful uploads if a later request fails.
  const uploaded = useRef(new Map<File, string>());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    setError("");
    if (user?.role !== 'ADMIN') { setError('프로젝트는 관리자만 등록할 수 있습니다.'); return; }
    if (!projectup.title.trim() || !projectup.description.trim()) {
      setError('프로젝트 이름과 상세 설명을 입력해주세요.'); return;
    }
    const team = members.filter((member) => member.name.trim() || member.role.trim())
      .map((member) => ({ name: member.name.trim(), role: member.role.trim() }));
    if (team.some((member) => !member.name || !member.role || member.name.length > 50 || member.role.length > 100)) {
      setError('팀원의 이름(50자 이하)과 역할(100자 이하)을 모두 입력해주세요.'); return;
    }
    const technologies = [...new Set(stacks.split(',').map((stack) => stack.trim()).filter(Boolean))];
    if (technologies.length > 50 || technologies.some((stack) => stack.length > 100)) {
      setError('기술 스택은 최대 50개, 각 100자 이하로 입력해주세요.'); return;
    }
    inFlight.current = true;
    setSubmitting(true);
    try {
      const upload = async (file: File | null) => {
        if (!file) return null;
        if (!uploaded.current.has(file)) uploaded.current.set(file, await uploadProjectImage(file));
        return uploaded.current.get(file)!;
      };
      const logo = await upload(projectup.logo);
      const banner = await upload(projectup.banner);
      const result = await createProject({
        generation: Number.parseInt(projectup.generation, 10), title: projectup.title.trim(),
        subtitle: projectup.subtitle.trim() || null, description: projectup.description.trim(),
        logo, banner, stacks: technologies, members: team,
      });
      navigate(`/Project/${result.projectId}`, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '프로젝트 등록에 실패했습니다.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  if (user?.role !== 'ADMIN') return <div className="mx-auto max-w-3xl p-10 text-center">
    <h1 className="mb-4 text-2xl font-bold">프로젝트 등록</h1>
    <p role="status">프로젝트는 관리자 계정으로 로그인한 후 등록할 수 있습니다.</p>
    <Link to={user ? '/Project' : '/SignIn'} className="mt-5 inline-block text-[#014BAA] underline">{user ? '프로젝트 목록' : '로그인'}</Link>
  </div>;

  return <div className="min-h-screen bg-gray-50 px-4 py-10">
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border bg-white p-6 shadow-lg md:p-10">
      <div><h1 className="text-3xl font-bold text-[#014BAA]">프로젝트 등록</h1>
        <p className="mt-2 text-sm text-gray-500">프로젝트 이름과 상세 설명은 필수입니다. 이미지와 팀원은 선택할 수 있습니다.</p></div>
      <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-8 disabled:opacity-60">
        <GenerationSelect generation={projectup.generation} setProjectup={setProjectup} />
        <ProjectupInfo projectup={projectup} setProjectup={setProjectup} />
        <ImageUpload projectup={projectup} setProjectup={setProjectup} />
        <Description projectup={projectup} setProjectup={setProjectup} />
        <label className="flex flex-col gap-2 font-bold text-[#014BAA]">기술 스택 (선택)
          <input value={stacks} onChange={(e) => setStacks(e.target.value)} placeholder="React, Spring Boot, MySQL" className="rounded-xl border p-3 font-normal text-gray-800" />
          <span className="text-sm font-normal text-gray-500">쉼표로 구분해주세요.</span>
        </label>
        <MemberList members={members} setMembers={setMembers} />
      </fieldset>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <SubmitButton disabled={submitting} />
      <Link to="/Project" className="text-center text-gray-500 underline">프로젝트 목록으로</Link>
    </form>
  </div>;
}
