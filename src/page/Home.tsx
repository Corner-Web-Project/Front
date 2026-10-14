import { useState, useEffect } from "react";

import githubLogo from "../assets/home/githubLogo.png";

interface People {
  peopleId: number;
  peoplePosition: string;
  peopleName: string;
  githubUrl: string;
  catImage: string;
}

interface PeopleForm {
  peoplePosition: string;
  peopleName: string;
  githubUrl: string;
}

const API_BASE_URL = "http://localhost:8080";

const emptyForm: PeopleForm = {
  peoplePosition: "",
  peopleName: "",
  githubUrl: "",
};

export default function Home() {
  const [displayText, setDisplayText] = useState("");

  // People 목록
  const [peopleList, setPeopleList] = useState<People[]>([]);

  // 현재 수정 중인 멤버 ID
  const [editingId, setEditingId] = useState<number | null>(null);

  // 새 멤버 등록 상태
  const [isAdding, setIsAdding] = useState(false);

  // 입력창에 표시할 값
  const [form, setForm] = useState<PeopleForm>(emptyForm);

  // 작업 결과 및 오류 메시지
  const [message, setMessage] = useState("");

  // JWT 토큰 가져오기
  const getAccessToken = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return null;
    }

    return accessToken.startsWith("Bearer ")
      ? accessToken
      : `Bearer ${accessToken}`;
  };

  // 타이핑 효과
  useEffect(() => {
    const fullText =
      "Gyeongsang National University · Applied Software Lab";

    let index = 0;

    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // People 목록 조회
  const getPeopleList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/people`);

      if (!response.ok) {
        throw new Error("People 목록 조회 실패");
      }

      const data: People[] = await response.json();
      setPeopleList(data);
    } catch (error) {
      console.error("People 조회 에러:", error);
      setMessage("멤버 목록을 불러오지 못했어.");
    }
  };

  useEffect(() => {
    getPeopleList();
  }, []);

  // 입력값 변경
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 새 멤버 입력창 열기
  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsAdding(true);
    setMessage("");
  };

  // 기존 멤버 수정 모드로 변경
  const handleEdit = (people: People) => {
    setIsAdding(false);
    setEditingId(people.peopleId);

    setForm({
      peoplePosition: people.peoplePosition,
      peopleName: people.peopleName,
      githubUrl: people.githubUrl,
    });

    setMessage("");
  };

  // 입력창 취소
  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyForm);
    setMessage("");
  };

  // 멤버 추가 및 수정 저장
  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setMessage("");

    const token = getAccessToken();

    if (!token) {
      setMessage("로그인이 필요해. 다시 로그인해 줘.");
      return;
    }

    if (
      !form.peopleName.trim() ||
      !form.peoplePosition.trim()
    ) {
      setMessage("직책, 이름을 모두 입력");
      return;
    }

    const isEditing = editingId !== null;

    const url = isEditing
      ? `${API_BASE_URL}/api/people/${editingId}`
      : `${API_BASE_URL}/api/people`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(
          `멤버 ${isEditing ? "수정" : "추가"} 실패 (${response.status})`
        );
      }

      await getPeopleList();

      setEditingId(null);
      setIsAdding(false);
      setForm(emptyForm);
      setMessage(
        isEditing
          ? "멤버 정보를 수정함."
          : "새 멤버를 추가함."
      );
    } catch (error) {
      console.error("멤버 저장 에러:", error);
      setMessage(
        "저장에 실패함. 로그인 상태와 서버 응답 확인해야 함."
      );
    }
  };

  // 멤버 삭제
  const handleDelete = async (people: People) => {
    const confirmed = window.confirm(
      `${people.peopleName} 멤버를 삭제할까?`
    );

    if (!confirmed) {
      return;
    }

    const token = getAccessToken();

    if (!token) {
      setMessage("로그인이 필요해. 다시 로그인해 줘.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/people/${people.peopleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`멤버 삭제 실패 (${response.status})`);
      }

      if (editingId === people.peopleId) {
        handleCancel();
      }

      await getPeopleList();
      setMessage("멤버를 삭제했어.");
    } catch (error) {
      console.error("멤버 삭제 에러:", error);
      setMessage(
        "삭제에 실패했어. 로그인 상태와 서버 응답을 확인해 줘."
      );
    }
  };

  // 입력창 스타일
  const inputClass =
    "w-full rounded-md border border-[#014BAA]/40 bg-white px-2 py-2 text-sm text-[#014BAA] outline-none focus:border-[#014BAA]";

  // 버튼 스타일
  const buttonClass =
    "rounded-md border border-[#014BAA] px-3 py-1 text-sm text-[#014BAA] transition hover:bg-[#014BAA] hover:text-white";

  return (
    <main>
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>

      {/* HERO */}
      <section className="relative flex h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#F8F3F0]">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#014BAA 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#014BAA]/[0.02] to-transparent" />

        {/* 네 방향 코너 프레임 */}
        {[
          "left-10 top-10 md:left-16 md:top-16",
          "right-10 top-10 rotate-90 md:right-16 md:top-16",
          "right-10 bottom-10 rotate-180 md:right-16 md:bottom-16",
          "left-10 bottom-10 -rotate-90 md:left-16 md:bottom-16",
        ].map((position, index) => (
          <svg
            key={position}
            className={`absolute h-24 w-24 md:h-40 md:w-40 ${position}`}
            viewBox="0 0 160 160"
            fill="none"
          >
            <path
              d="M2 2 V130"
              stroke="#014BAA"
              strokeWidth="3"
              strokeLinecap="square"
              strokeDasharray="130"
              strokeDashoffset="130"
              className="animate-[draw-line_0.8s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
            <path
              d="M2 2 H130"
              stroke="#014BAA"
              strokeWidth="3"
              strokeLinecap="square"
              strokeDasharray="130"
              strokeDashoffset="130"
              className="animate-[draw-line_0.8s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          </svg>
        ))}

        {/* 플로팅 도형 */}
        <div
          className="absolute h-4 w-4 rounded-full border border-[#014BAA] opacity-30"
          style={{
            top: "20%",
            left: "15%",
            animation: "float 6s ease-in-out infinite",
          }}
        />

        <div
          className="absolute h-6 w-6 rotate-45 bg-[#014BAA] opacity-10"
          style={{
            top: "70%",
            right: "20%",
            animation: "float 8s ease-in-out infinite 1s",
          }}
        />

        <div
          className="absolute h-3 w-3 rounded-full border border-[#014BAA] opacity-20"
          style={{
            bottom: "25%",
            left: "25%",
            animation: "float 7s ease-in-out infinite 2s",
          }}
        />

        {/* 타이틀 */}
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ perspective: "1000px" }}
        >
          <h1
            className="translate-y-4 text-4xl font-bold tracking-[0.3em] text-[#014BAA] opacity-0 animate-[fade-up_0.6s_ease-out_forwards] md:text-6xl"
            style={{ animationDelay: "0.8s" }}
          >
            CORNER ROOM
          </h1>

          <p
            className="mt-6 h-6 text-sm font-light tracking-wider text-[#014BAA]/70 opacity-0 animate-[fade-up_0.6s_ease-out_forwards] md:text-base"
            style={{ animationDelay: "1.2s" }}
          >
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </section>

      {/* 학과 소개 */}
      <section className="flex h-[350px] justify-center">
        <div>
          <br />
          <h1 className="text-3xl text-[#014BAA]">
            경상국립대학교 컴퓨터공학과 응용 소프트웨어 개발실
          </h1>
        </div>
      </section>

      {/* PEOPLE */}
      <section>
        <h2 className="text-center text-3xl text-[#014BAA]">
          PEOPLE
        </h2>

        <div className="mx-auto mt-10 flex max-w-6xl justify-end px-6">
          <button
            type="button"
            className={buttonClass}
            onClick={handleAdd}
            disabled={isAdding}
          >
            멤버 추가
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-[#014BAA]">
            {message}
          </p>
        )}

        <div className="mx-auto mb-60 mt-12 grid max-w-6xl grid-cols-1 justify-items-center gap-x-8 gap-y-20 px-6 sm:grid-cols-2 md:grid-cols-3">
          {/* 새 멤버 입력 카드 */}
          {isAdding && (
            <div className="flex w-48 flex-col items-center">
              <div className="flex h-35 w-35 items-center justify-center rounded-full border border-dashed border-[#014BAA]/50 bg-[#ECEAE9] text-sm text-[#014BAA]">
                새 멤버
              </div>

              <form
                onSubmit={handleSave}
                className="mt-4 flex w-full flex-col gap-2 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-3"
              >
                <input
                  className={inputClass}
                  name="peoplePosition"
                  value={form.peoplePosition}
                  onChange={handleInputChange}
                  placeholder="직책 (예: 실원)"
                  aria-label="직책"
                  required
                />

                <input
                  className={inputClass}
                  name="peopleName"
                  value={form.peopleName}
                  onChange={handleInputChange}
                  placeholder="이름"
                  aria-label="이름"
                  required
                />

                <input
                  className={inputClass}
                  name="githubUrl"
                  type="url"
                  value={form.githubUrl}
                  onChange={handleInputChange}
                  placeholder="GitHub 주소"
                  aria-label="GitHub 주소"
                />

                <div className="mt-1 flex justify-center gap-2">
                  <button type="submit" className={buttonClass}>
                    등록
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 기존 멤버 카드 */}
          {peopleList.map((people) => {
            const isEditing = editingId === people.peopleId;

            return (
              <div
                key={people.peopleId}
                className="flex flex-col items-center"
              >
                <img
                  src={`${API_BASE_URL}/${people.catImage}`}
                  alt={people.peopleName}
                  className="h-35 w-35 rounded-full"
                />

                {/* 수정 모드일 때 기존 카드 안에서 입력 */}
                {isEditing ? (
                  <form
                    onSubmit={handleSave}
                    className="mt-4 flex w-48 flex-col gap-2 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-3"
                  >
                    <input
                      className={inputClass}
                      name="peoplePosition"
                      value={form.peoplePosition}
                      onChange={handleInputChange}
                      placeholder="직책"
                      aria-label="직책"
                      required
                    />

                    <input
                      className={inputClass}
                      name="peopleName"
                      value={form.peopleName}
                      onChange={handleInputChange}
                      placeholder="이름"
                      aria-label="이름"
                      required
                    />

                    <input
                      className={inputClass}
                      name="githubUrl"
                      type="url"
                      value={form.githubUrl}
                      onChange={handleInputChange}
                      placeholder="GitHub 주소"
                      aria-label="GitHub 주소"
                    />

                    <div className="mt-1 flex justify-center gap-2">
                      <button type="submit" className={buttonClass}>
                        저장
                      </button>
                      <button
                        type="button"
                        className={buttonClass}
                        onClick={handleCancel}
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* 이미지와 멤버 정보 사이의 버튼 */}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className={buttonClass}
                        onClick={() => handleEdit(people)}
                      >
                        수정
                      </button>

                      <button
                        type="button"
                        className={buttonClass}
                        onClick={() => handleDelete(people)}
                      >
                        삭제
                      </button>
                    </div>

                    {/* 기존 멤버 정보 */}
                    <div className="mt-3 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
                      <p>
                        {people.peoplePosition} {people.peopleName}
                      </p>

                      <a
                        href={people.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={githubLogo}
                          alt="GitHub"
                          className="mx-auto mt-3 h-6 w-6"
                        />
                      </a>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}