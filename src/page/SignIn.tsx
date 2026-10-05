import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Input from "../components/Input"
import { useAuth } from "../context/AuthContext"
import { createToken, getMyMember } from "../api/member"
export default function SignIn() {

  const [id, setId] = useState("")
  const [pw, setPw] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const accessToken = await createToken({ studentId: id, password: pw })
      const member = await getMyMember(accessToken)
      login(accessToken, member)
      navigate("/")
    } catch (error) {
      alert((error as Error).message)
    }
  }

  
  return (
    <main className="w-full h-[93.9033695vh] flex justify-center items-center gap-[8vw]">
      <div className="w-[600px] text-[#014BAA] text-center flex flex-col items-center">
        <p className="text-[40px] leading-[1.4]">
          아직<br />
          구석방에 가입하지 않았다면
        </p>

        <p className="mt-6 text-[18px] leading-[1.5]">
          회원가입하고 더 자세한 소식<br />
          알아갈 수 있습니다.
        </p>

        <Link
          to="/SignUp"
          className="mt-8 px-4 py-2 bg-[#014BAA] rounded-lg text-white text-sm transition duration-200 hover:scale-105"
        >
          회원가입
        </Link>
      </div>
      <div className="w-[600px] h-[500px] bg-[#BDDAFF] rounded-2xl drop-shadow-xl/30 flex flex-col items-center ">
        <div className="w-full h-[115px] flex justify-center items-center">
          <span className="text-[30px] text-[#014BAA]">Log In</span>
        </div>
        <form id="SignIn" name="SignIn" method="post" onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col">
            <label htmlFor="ID" className="text-[#014BAA]">ID</label>
            <Input onChange={(e) => {setId(e.target.value)}} id="ID" type="text" className="pl-2 w-[480px] h-[40px] border-b-1 mb-6 bg-[#BDDAFF] border-[#014BAA] transition- duration-300 ease-linear outline-0 hover:border-b-2 focus:outline-0"  />
          </div>
          <div className="flex flex-col">
            <label htmlFor="PW" className="text-[#014BAA]">PASSWORD</label>
            <Input onChange={(e) => {setPw(e.target.value)}} id="PW" type="password" className="pl-2 w-[480px] h-[40px] border-b-1 bg-[#BDDAFF] border-[#014BAA] transition- duration-300 ease-linear outline-0 hover:border-b-2 focus:outline-0" />
          </div>
        </form>
        <div className="w-1/3 h-18 flex justify-between">
          <Link to="/SignIn/FindID" className="text-[#014BAA]" >아이디 찾기</Link>
          <Link to="/SignIn/FindPW" className="text-[#014BAA]">비밀번호 찾기</Link>
        </div>
        <button form="SignIn" type="submit" className="w-[120px] h-[45px] bg-[#014BAA] rounded-xl text-xl text-white font-light">로그인</button>
      </div>
    </main>
  )
}

