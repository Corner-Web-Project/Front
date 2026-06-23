
import './Nav.css';
export default function Nav(){
  return(
    <nav className='Navbar'>
      <span><h1><img src="" alt="로고" /></h1></span>

      <div className="menu-container">
        <span>About Us</span>
        <span>Schedule</span>
        <span>Project</span>
        <span>Notice</span>
        <span>Join</span>
      </div>
      
      <span className="login-btn">Log In</span>
    </nav>
  );
}