import { Link, NavLink } from 'react-router';

export default function Nav(){
  return(
    <nav className='w-full h-[80px] flex justify-around items-center text-[1.563em] text-[rgba(1,75,170,0.73)] '>
      <Link to="/" className='transition duration-300 ease-linear hover:scale-110 '><img className='' src="/mainLogo.svg" alt="" /></Link>

      <div className="w-1/3 flex justify-evenly mr-32">
        <NavLink to="/"
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[43px]
            ${isActive ? 'hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium'}
            `
          }>About Us</NavLink>
        <NavLink 
          to="/Schedule" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[43px]
            ${isActive ? 'hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium'}
            `
          }>Schedule</NavLink>
        <NavLink 
          to="/Project" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[43px]
            ${isActive ? 'hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium'}
            `
          }>Project</NavLink>
        <NavLink 
          to="/Notice" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear mr-[43px]
            ${isActive ? 'hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium'}
            `
          }>Notice</NavLink>
        <NavLink 
          to="/Join" 
          className={({ isActive }) => 
            `transition duration-250 ease-linear
            ${isActive ? 'hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium'}
            `
          }>Join</NavLink>
      </div>
      
      <NavLink 
        to="/SignIn" 
        className={({ isActive }) => 
          `transition duration-250 ease-linear 
          ${isActive ? 'hover:scale-110 text-[#014BAA] font-medium' : 'hover:text-[#014BAA] hover:scale-110 hover:font-medium'}
          `
        }>SignIn</NavLink>
    </nav>
  );
}