import Input from "../components/Input"

export default function SignIn() {
  return (
    <main className="w-full h-[93.9033695vh] flex justify-center items-center">
      <div className="w-[600px] h-[500px] bg-[#BDDAFF] rounded-2xl drop-shadow-2xl/30 flex flex-col items-center ">
        <div className="w-full h-[115px] flex justify-center items-center">
          <span className="text-[30px] text-[#014BAA]">Log In</span>
        </div>
        <div className="flex flex-col">
          <label htmlFor="ID" className="text-[#014BAA]">ID</label>
          <Input id="ID" type="text" className="pl-2 w-[480px] h-[40px] border-b-1 bg-[#BDDAFF] border-[#014BAA] transition- duration-300 ease-linear outline-0 hover:border-b-2 focus:outline-0" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="PW" className="text-[#014BAA]">Password</label>
          <Input id="PW" type="password" className="pl-2 w-[480px] h-[40px] border-b-1 bg-[#BDDAFF] border-[#014BAA] transition- duration-300 ease-linear outline-0 hover:border-b-2 focus:outline-0" />
        </div>
      </div>
    </main>
  )
}

