
export default function HeroSection() {
  return (
    <section className="flex flex-col items-center px-4 py-12 md:py-16">
      
    
      <div
        className="
          relative
          w-full
          max-w-[calc(100vw-32px)]
          md:w-[750px]
          rounded-2xl
          bg-white
          p-6
          md:p-8
          text-white
          shadow-xl
          animate-fade
        "
      >

        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-8 md:text-left">

          
          <img
            src="/mainLogo.svg"
            alt="logo"
            className="w-48 md:w-60"
          />

          <div>
            <p className="mt-1 text-2xl font-bold md:text-4xl text-[#014BAA]">
               PROJECT
            </p>

            
            {/* <h1 className="mt-1 text-2xl font-bold md:text-4xl text-[#014BAA]">
              구석방의 프로젝트
            </h1> */}

            <p className="mt-3 text-base md:mt-3 md:text-lg opacity-90 text-[#014BAA]">
             | 구석방의 프로젝트를 소개합니다.
            </p>
          </div>

        </div>

      </div>

      
      <div className="mt-8 md:mt-12 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 md:h-10 md:w-10 text-[#014BAA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

    </section>
  );
}
