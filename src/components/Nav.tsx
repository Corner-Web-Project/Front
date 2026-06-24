import { Link, NavLink } from 'react-router';

export default function Nav(){
  return(
    <nav className='w-max h-[80px] flex justify-around items-center text-[25px] text-[rgba(1,75,170,0.73)]'>
      <Link to="/"><img src="/mainLogo.svg" alt="" /></Link>

      <div className="">
        <NavLink to="/"
          className={({ isActive }) => 
            `
            ${isActive ? 'text-[#014BAA] font-bold' : 'hover:text-[#014BAA] font-bold'}
            `
          }>About Us</NavLink>
        <NavLink 
          to="/Schedule" 
          className={({ isActive }) => 
            `
            ${isActive ? 'text-[#014BAA] font-bold' : 'hover:text-[#014BAA] font-bold'}
            `
          }>Schedule</NavLink>
        <NavLink 
          to="/Project" 
          className={({ isActive }) => 
            `
            ${isActive ? 'text-[#014BAA] font-bold' : 'hover:text-[#014BAA] font-bold'}
            `
          }>Project</NavLink>
        <NavLink 
          to="/Notice" 
          className={({ isActive }) => 
            `
            ${isActive ? 'text-[#014BAA] font-bold' : 'hover:text-[#014BAA] font-bold'}
            `
          }>Notice</NavLink>
        <NavLink 
          to="/Join" 
          className={({ isActive }) => 
            `
            ${isActive ? 'text-[#014BAA] font-bold' : 'hover:text-[#014BAA] font-bold'}
            `
          }>Join</NavLink>
      </div>
      
      <NavLink 
        to="/SignIn" 
        className={({ isActive }) => 
          isActive ? 'text-[#014BAA] font-bold' : 'hover:text-[#014BAA] font-bold'
        }>Sign In</NavLink>
    </nav>
  );
}