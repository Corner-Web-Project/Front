import { useState } from "react"
import { Link, useNavigate } from "react-router"

export default function SignUp() {
  const [id, setId] = useState("")
  const [pw, setPw] = useState("")
  const [pwCheck, setPwCheck] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!id || !pw || !pwCheck || !name || !email) {
      alert("모든 항목을 입력해주세요.")
      return
    }

    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    console.log({
      id,
      pw,
      name,
      email,
    })

    alert("회원가입이 완료되었습니다.")

    navigate("/SignIn")
  }

  return (
    <main className="w-full h-[93.9033695vh] flex justify-center items-center">

      <div className="
        relative
        w-[600px]
        h-[700px]
        bg-[#BDDAFF]
        rounded-2xl
        shadow-[0_20px_50px_rgba(1,75,170,0.12)]
        flex
        flex-col
        items-center
      ">

        {/* 상단 포인트 */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#014BAA] rounded-t-2xl" />

        {/* 제목 */}
        <div className="w-[480px] pt-12 pb-8">

          <p className="
            text-[11px]
            tracking-[0.3em]
            text-[#014BAA]/50
            mb-2
          ">
            WELCOME
          </p>

          <div className="flex items-end justify-between">
            <span className="text-[32px] font-medium text-[#014BAA]">
              Sign Up
            </span>

            <span className="text-[12px] text-[#014BAA]/50 mb-1">
              회원가입
            </span>
          </div>

          <div className="mt-3 w-full h-px bg-[#014BAA]/15" />

        </div>


        {/* 회원가입 Form */}
        <form
          id="SignUp"
          name="SignUp"
          method="post"
          onSubmit={handleSubmit}
          className="w-[480px]"
        >

          {/* ID */}
          <div className="flex flex-col mb-5">

            <label
              htmlFor="ID"
              className="text-[13px] text-[#014BAA] mb-1"
            >
              아이디
              <span className="ml-2 text-[11px] text-[#014BAA]/50">
                학번을 입력해주세요.
              </span>
            </label>

            <input
              id="ID"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="
                pl-2
                w-full
                h-[40px]
                bg-transparent
                border-b
                border-[#014BAA]/35
                outline-none
                transition-all
                duration-300
                hover:border-[#014BAA]/70
                focus:border-[#014BAA]
              "
            />

          </div>


          {/* PASSWORD */}
          <div className="flex flex-col mb-5">

            <label
              htmlFor="PW"
              className="text-[13px] text-[#014BAA] mb-1"
            >
              비밀번호
            </label>

            <input
              id="PW"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="
                pl-2
                w-full
                h-[40px]
                bg-transparent
                border-b
                border-[#014BAA]/35
                outline-none
                transition-all
                duration-300
                hover:border-[#014BAA]/70
                focus:border-[#014BAA]
              "
            />

          </div>


          {/* PASSWORD CHECK */}
          <div className="flex flex-col mb-5">

            <label
              htmlFor="PWCheck"
              className="text-[13px] text-[#014BAA] mb-1"
            >
              비밀번호 재확인
            </label>

            <input
              id="PWCheck"
              type="password"
              value={pwCheck}
              onChange={(e) => setPwCheck(e.target.value)}
              className="
                pl-2
                w-full
                h-[40px]
                bg-transparent
                border-b
                border-[#014BAA]/35
                outline-none
                transition-all
                duration-300
                hover:border-[#014BAA]/70
                focus:border-[#014BAA]
              "
            />

          </div>


          {/* NAME */}
          <div className="flex flex-col mb-5">

            <label
              htmlFor="Name"
              className="text-[13px] text-[#014BAA] mb-1"
            >
              이름
            </label>

            <input
              id="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                pl-2
                w-full
                h-[40px]
                bg-transparent
                border-b
                border-[#014BAA]/35
                outline-none
                transition-all
                duration-300
                hover:border-[#014BAA]/70
                focus:border-[#014BAA]
              "
            />

          </div>


          {/* EMAIL */}
          <div className="flex flex-col">

            <label
              htmlFor="Email"
              className="text-[13px] text-[#014BAA] mb-1"
            >
              이메일
            </label>

            <input
              id="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                pl-2
                w-full
                h-[40px]
                bg-transparent
                border-b
                border-[#014BAA]/35
                outline-none
                transition-all
                duration-300
                hover:border-[#014BAA]/70
                focus:border-[#014BAA]
              "
            />

          </div>

        </form>


        <div className="w-[480px] mt-6">

          {/* 로그인으로 돌아가기 */}
          <div>
            <Link
              to="/SignIn"
              className="
                text-[12px]
                text-[#014BAA]/55
                transition
                duration-200
                hover:text-[#014BAA]
              "
            >
              ← 로그인으로 돌아가기
            </Link>
          </div>

          {/* 회원가입 버튼 */}
          <div className="flex justify-center mt-5">
            <button
              form="SignUp"
              type="submit"
              className="
                w-[120px]
                h-[42px]
                bg-[#014BAA]
                rounded-xl
                text-[15px]
                text-white
                font-light
                shadow-[0_8px_20px_rgba(1,75,170,0.18)]
                transition-all
                duration-200
                hover:scale-[1.03]
                hover:shadow-[0_10px_25px_rgba(1,75,170,0.25)]
                active:scale-[0.98]
              "
            >
              회원가입
            </button>
          </div>

        </div>

      </div>

    </main>
  )
}