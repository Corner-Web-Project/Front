import { Link, NavLink } from 'react-router';
import { useAuth } from "../context/auth"


export default function Nav(){
  const { user, logout } = useAuth()

  return(
    <nav className='w-full h-[80px] flex justify-around items-center text-[1.05vw] text-[rgba(1,75,170,0.73)] '>
      <Link to="/" className='w-[8.4vw] transition duration-300 ease-linear hover:scale-110 '><img className='' src="/mainLogo.svg" alt="" /></Link>

      <div className="w-1/3 flex justify-evenly mr-32">
        <NavLink to="/"
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[2.24vw] group flex items-end overflow-hidden
            ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
            `
          }>About Us</NavLink>
        <NavLink 
          to="/Schedule" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[2.24vw]
            ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
            `
          }>Schedule</NavLink>
        <NavLink 
          to="/Project" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[2.24vw]
            ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
            `
          }>Project</NavLink>
        <NavLink 
          to="/ITNews" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[2.24vw]
            ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
            `
          }>IT News</NavLink>
        <NavLink 
          to="/Notice" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[2.24vw]
            ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
            `
          }>Notice</NavLink>
        <NavLink 
          to="/Join" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear
            ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
            `
          }>Join</NavLink>
      </div>
      
      {user ? (
        <div className="flex items-center">
          {user.role === 'ADMIN' && (
            <NavLink to="/Projectup" className="mr-4 whitespace-nowrap rounded-lg bg-[#014BAA] px-4 py-2 text-white">
              프로젝트 등록
            </NavLink>
          )}
          <span className="text-[#014BAA] font-medium mr-3">
            {user.name}님
          </span>

          <button
            onClick={logout}
            className="
              border-l border-[#014BAA]/20
              pl-3
              text-[#014BAA]/55
              transition duration-200
              hover:text-[#014BAA]
            "
          >
            logout
          </button>

          {/* 운영진(ADMIN)만 관리자 페이지 이동 버튼 표시 */}
          {user.role === "ADMIN" && (
            <Link
              to="/Admin"
              className="
                ml-3
                border-l border-[#014BAA]/20
                pl-3
                text-[#014BAA]/55
                transition duration-200
                hover:text-[#014BAA]
              "
            >
              Admin
            </Link>
          )}
        </div>
      ) : (
        <NavLink to="/SignIn">
          SignIn
        </NavLink>
      )}
    </nav>
  );
}
