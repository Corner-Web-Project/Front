import { useState, useEffect } from "react";
import cat1 from "../assets/home/cat1.png";
import cat2 from "../assets/home/cat2.png";
import cat3 from "../assets/home/cat3.png";
import cat4 from "../assets/home/cat4.png";
import cat5 from "../assets/home/cat5.png";
import cat6 from "../assets/home/cat6.png";
import cat7 from "../assets/home/cat7.png";
import cat8 from "../assets/home/cat8.png";
import cat9 from "../assets/home/cat9.png";

export default function Home() {
  const [displayText, setDisplayText] = useState("");

  // 타이핑 효과
  useEffect(() => {
    const fullText = "Gyeongsang National University · Applied Software Lab";
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

  return (
    <main>
      {/* Keyframes 정의 */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(1rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes scroll-line {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="relative flex h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#F8F3F0]">
        {/* 3. 배경 도트 패턴 + 그라데이션 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#014BAA 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#014BAA]/[0.02] to-transparent" />

        {/* 1. 4방향 코너 프레임 */}
        {/* 좌상단 */}
        <svg
          className="absolute left-10 top-10 h-24 w-24 md:left-16 md:top-16 md:h-40 md:w-40"
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
          />
          <path
            d="M2 2 H130"
            stroke="#014BAA"
            strokeWidth="3"
            strokeLinecap="square"
            strokeDasharray="130"
            strokeDashoffset="130"
            className="animate-[draw-line_0.8s_ease-out_forwards]"
          />
        </svg>

        {/* 우상단 */}
        <svg
          className="absolute right-10 top-10 h-24 w-24 rotate-90 md:right-16 md:top-16 md:h-40 md:w-40"
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
            className="animate-[draw-line_0.8s_ease-out_0.2s_forwards]"
          />
          <path
            d="M2 2 H130"
            stroke="#014BAA"
            strokeWidth="3"
            strokeLinecap="square"
            strokeDasharray="130"
            strokeDashoffset="130"
            className="animate-[draw-line_0.8s_ease-out_0.2s_forwards]"
          />
        </svg>

        {/* 우하단 */}
        <svg
          className="absolute right-10 bottom-10 h-24 w-24 rotate-180 md:right-16 md:bottom-16 md:h-40 md:w-40"
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
            className="animate-[draw-line_0.8s_ease-out_0.4s_forwards]"
          />
          <path
            d="M2 2 H130"
            stroke="#014BAA"
            strokeWidth="3"
            strokeLinecap="square"
            strokeDasharray="130"
            strokeDashoffset="130"
            className="animate-[draw-line_0.8s_ease-out_0.4s_forwards]"
          />
        </svg>

        {/* 좌하단 */}
        <svg
          className="absolute left-10 bottom-10 h-24 w-24 -rotate-90 md:left-16 md:bottom-16 md:h-40 md:w-40"
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
            className="animate-[draw-line_0.8s_ease-out_0.6s_forwards]"
          />
          <path
            d="M2 2 H130"
            stroke="#014BAA"
            strokeWidth="3"
            strokeLinecap="square"
            strokeDasharray="130"
            strokeDashoffset="130"
            className="animate-[draw-line_0.8s_ease-out_0.6s_forwards]"
          />
        </svg>

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

        {/* 3D 틸트 로고 & 타이핑 서브타이틀 */}
        <div
          className="relative z-10 flex flex-col items-center"
          style={{
            perspective: "1000px",
          }}
        >
          <h1
            className="translate-y-4 text-4xl font-bold tracking-[0.3em] text-[#014BAA] opacity-0 animate-[fade-up_0.6s_ease-out_forwards] md:text-6xl"
            style={{
              animationDelay: "0.8s"
            }}
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
        <h2 className="text-center text-3xl text-[#014BAA]">PEOPLE</h2>

        <div className="mx-auto mt-35 grid max-w-6xl grid-cols-3 justify-items-center gap-x-8 gap-y-20 mb-60">
          <div className="flex flex-col items-center">
            <img src={cat1} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실장 김용환</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat2} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 변경태</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat3} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 홍종민</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat4} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 박건우</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat5} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 박성우</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat6} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 김치우</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat7} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 김보민</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat8} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 오성민</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat9} className="h-35 w-35 rounded-full" />
            <div className="mt-4 w-30 rounded-xl border border-[#014BAA] bg-[#ECEAE9] p-1 text-center text-[#014BAA]">
              <p>실원 이진리</p>
              <br />
              <p>github logo</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}