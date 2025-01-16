import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '../../context/loginContext';
import './Navbar.css';

function Navbar() {
  const { id, setId } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setId(null);
    navigate('/login');
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-links">
          <Link to="/">Home</Link>
          {id && (
            <>
              <Link to="/product">My Products</Link>
              <Link to="/chat">My Chats</Link>
            </>
          )}
        </div>
        
        <div className="nav-auth">
          {id ? (
            <button className="button button-outline" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="button button-outline">Login</button>
              </Link>
              <Link to="/register">
                <button className="button button-primary">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;