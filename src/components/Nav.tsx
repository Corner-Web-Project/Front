
import './Nav.css';
export default function Nav(){
  return(
    <nav className='Navbar'>
      <span><h1><img src="" alt="" /></h1></span>
      <div className="menu-container">
        <span>About Us</span>
        <span>Schedule</span>
        <span>Project</span>
        <span>Notice</span>
        <span>Join</span>
        <span style={{marginLeft:'auto'}}>Log In</span>
      </div>
      <span className="border-4">Log In</span>
    </nav>
  )
}