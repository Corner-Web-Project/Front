import { Link, NavLink } from 'react-router';

export default function Nav(){
  return(
    <nav className='w-full h-[80px] flex justify-around items-center text-[1.35vw] text-[rgba(1,75,170,0.73)] '>
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
      
      <NavLink 
        to="/SignIn" 
        className={({ isActive }) => 
          `transition duration-250 ease-linear 
          ${isActive ? 'border-b-1 hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium hover:border-b-1'}
          `
        }>SignIn</NavLink>
    </nav>
  );
}