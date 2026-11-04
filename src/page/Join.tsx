import { useState, type FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import FormTextarea from "../components/FormTextarea";
import { apiUrl } from "../api/config";
import { submitJoinApplication } from "../api/join";

export default function Join() {
  const navigate = useNavigate();
  const [isWriting, setIsWriting] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const handlePhoneChange = (
  e:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
) => {
  const value = e.target.value.replace(/\D/g, "");
  if (value.length < 4) {
    setPhone(value);
  } else if (value.length < 8) {
    setPhone(`${value.slice(0, 3)}-${value.slice(3)}`);
  } else {
    setPhone(
      `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
    );
  }
};

 const handleStudentId = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setStudentId(
    e.target.value.replace(/\D/g, "")
  );
};

 const handleNameChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setName(e.target.value.replace(/\d/g, ""));
};

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmissionError("");

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!studentId.trim()) {
      alert("학번을 입력해주세요.");
      return;
    }

    if (!major.trim()) {
      alert("학과를 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!reason.trim()) {
      alert("지원동기를 입력해주세요.");
      return;
    }

    

    setIsSubmitting(true);

    try {
      await submitJoinApplication(apiUrl('/api/join-applications'), {
          name: name.trim(),
          studentId: studentId.trim(),
          major: major.trim(),
          phone: phone.trim(),
          motivation: reason.trim(),
          portfolioUrl: portfolio.trim() || null,
          comment: comment.trim(),
      });

      alert("가입 신청이 제출되었습니다.");
      navigate("/", { replace: true });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "가입 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F8F3F0] p-6">

      {isWriting ? (

        <div className="relative w-[600px] h-[300px]">

          <div className="absolute inset-0 bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center gap-6">

            <h1 className="text-4xl font-extrabold text-[#014BAA]">
              구석방 가입 신청
            </h1>

            <p className="text-gray-500">
              응용 SW 개발실 구석방에서 신입 부원을 모집합니다.
            </p>

            <div className="w-full h-[1px] bg-gray-200"></div>

            <button
              onClick={() => setIsWriting(false)}
              className="text-[#014BAA] font-semibold text-base cursor-pointer transition-colors duration-200 hover:text-[#003882] hover:underline underline-offset-4"
            >
              신청하러 가기
            </button>

          </div>

        </div>

      ) : (

        <div className="w-[600px] bg-white p-8 rounded-xl shadow-md">

          <h2 className="text-xl font-bold mb-6">
            📋 신청서 작성
          </h2>

          <form id="join-application-form" onSubmit={handleSubmit} className="flex flex-col gap-5">

            <FormInput
              label="이름"
              placeholder="홍길동"
              required
              value={name}
              onChange={handleNameChange}
              maxLength={50}
            />

            <FormInput
              label="학번"
              placeholder="202612345"
              required
              value={studentId}
              onChange={handleStudentId}
              maxLength={20}
              />

            <FormInput
              label="학과"
              placeholder="컴퓨터공학과"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              maxLength={50}
            />

           <FormInput
            label="전화번호"
            placeholder="010-0000-0000"
            required
            value={phone}
            onChange={handlePhoneChange}
/>

            <FormTextarea
              label="지원동기"
              placeholder="지원동기를 입력하세요."
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
            />

            <FormTextarea
              label="포트폴리오 / 활동 링크"
              placeholder="GitHub, Blog, Notion 등의 링크를 입력해 주세요."
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              maxLength={255}
            />

            <FormTextarea
              label="하고 싶은 말"
              placeholder="자유롭게 작성해주세요."
            
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={300}
            />

            {submissionError && (
              <p role="alert" className="text-sm text-red-600">
                {submissionError}
              </p>
            )}

          </form>

          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={() => setIsWriting(true)}
              disabled={isSubmitting}
              className="w-1/3 bg-gray-100 p-3 rounded-xl transition-colors duration-200 hover:bg-[#e3e2e2]"
            >
              이전으로
            </button>

            <button
              type="submit"
              form="join-application-form"
              disabled={isSubmitting}
              className="w-2/3 bg-[#014BAA] text-white p-3 rounded-xl transition-colors duration-200 hover:bg-[#003882] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "제출 중..." : "제출하기"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
