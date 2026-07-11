import { useState } from 'react';
import FormItem from '../components/FormItem';

export default function Join() {
  const [isWriting, setIsWriting] = useState<boolean>(true);

  
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
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

    if (!comment.trim()) {
      alert("하고 싶은 말을 입력해주세요.");
      return;
    }

    alert("제출 완료!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">

      {isWriting ? (

        <div className="relative w-[600px] h-[300px]">

          <div className="absolute inset-0 bg-[#014BAA] opacity-20 rounded-2xl -translate-x-4 -translate-y-4 shadow-md"></div>

          <div className="absolute inset-0 bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center gap-6">

            <h1 className="text-4xl font-extrabold text-[#014BAA]">
              구석방 가입 신청
            </h1>

            <p className="text-gray-500">
              응용 SW 개발실 구석방에서 신입 부원을 모집합니다.
            </p>

            <div className="w-full h-[1px] bg-gray-200"></div>

            <h2
              onClick={() => setIsWriting(false)}
              className="w-full px-8 py-4 bg-[#014BAA] text-white rounded-xl cursor-pointer"
            >
              🐱 신청하러 가기
            </h2>

          </div>

        </div>

      ) : (

        <div className="w-[400px] bg-white p-8 rounded-xl shadow-md">

          <h2 className="text-xl font-bold mb-6">
            📋 신청서 작성
          </h2>

          <form className="flex flex-col gap-5">

            <FormItem
              label="이름"
              placeholder="홍길동"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormItem
              label="학번"
              placeholder="202612345"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <FormItem
              label="학과"
              placeholder="컴퓨터공학과"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />

            <FormItem
              label="전화번호"
              placeholder="010-0000-0000"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <FormItem
              label="지원동기"
              placeholder="지원동기를 입력하세요."
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <FormItem
              label="하고 싶은 말"
              placeholder="자유롭게 작성해주세요."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

          </form>

          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={() => setIsWriting(true)}
              className="w-1/3 bg-gray-100 p-3 rounded-xl"
            >
              이전으로
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-2/3 bg-[#014BAA] text-white p-3 rounded-xl"
            >
              제출하기
            </button>

          </div>

        </div>

      )}

    </div>
  );
}