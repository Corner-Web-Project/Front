import cat1 from "../assets/home/cat1.PNG";
import cat2 from "../assets/home/cat2.PNG";
import cat3 from "../assets/home/cat3.PNG";
import cat4 from "../assets/home/cat4.PNG";
import cat5 from "../assets/home/cat5.PNG";
import cat6 from "../assets/home/cat6.PNG";
import cat7 from "../assets/home/cat7.PNG";
import cat8 from "../assets/home/cat8.PNG";
import cat9 from "../assets/home/cat9.PNG";

export default function Home() {
  return (
    <main className="">
      <section className="flex justify-center">
        <div className="w-[500px] h-[350px] bg-[#D9D9D9]"></div>
        <br />
      </section>

      <section className="flex justify-center h-[350px]">
        <div>
          logo
          <br />
          경상국립대학교 컴퓨터공학과 응용 소프트웨어 개발실
        </div>
      </section>

      <section className="">
        <h2 className="text-center text-[#014BAA] text-3xl">
          PEOPLE
          <br />
          <br />
          <br />
          <br />
          <br />
        </h2>

        <div className="grid grid-cols-3 gap-y-20">
          <img src={cat1} className="w-28 h-28 rounded-full"/>
          <img src={cat2} className="w-28 h-28 rounded-full"/>
          <img src={cat3} className="w-28 h-28 rounded-full"/>
          <img src={cat4} className="w-28 h-28 rounded-full"/>
          <img src={cat5} className="w-28 h-28 rounded-full"/>
          <img src={cat6} className="w-28 h-28 rounded-full"/>
          <img src={cat7} className="w-28 h-28 rounded-full"/>
          <img src={cat8} className="w-28 h-28 rounded-full"/>
          <img src={cat9} className="w-28 h-28 rounded-full"/>
        </div>
      </section>
    </main>
  )
}