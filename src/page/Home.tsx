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
  return (
    <main className="mt-10">
      <section className="flex justify-center">

        <div className="w-[650px] h-[500px] bg-[#D9D9D9]"></div>
        <br />
      </section>

      <section className="flex justify-center h-[350px] mt-20">
        <div>
          <br />
          <h1 className="text-[#014BAA] text-3xl">
            경상국립대학교 컴퓨터공학과 응용 소프트웨어 개발실
          </h1>
        </div>
      </section>

      <section className="">
        <h2 className="text-center text-[#014BAA] text-3xl">
          PEOPLE
        </h2>

        <div className="grid grid-cols-3 gap-y-20 gap-x-8 justify-items-center max-w-6xl mx-auto mt-35">
          
          <div className="flex flex-col items-center">
            <img src={cat1} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실장 김용환</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat2} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 변경태</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat3} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 홍종민</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat4} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 박건우</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat5} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 박성우</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat6} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 김치우</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat7} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 김보민</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat8} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 오성민</p>
              <br />
              <p>github logo</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={cat9} className="w-35 h-35 rounded-full"/>

            <div className="mt-4 border border-[#014BAA] rounded-xl w-24 text-center text-[#014BAA] p-1">
              <p>실원 이진리</p>
              <br />
              <p>github logo</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}