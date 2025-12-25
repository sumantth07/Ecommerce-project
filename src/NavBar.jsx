import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import logoImage from './assets/logo.jpg';
import cartImage from './assets/shopping-cart.png';

import homeicon from './assets/homeIcon.jpg';
import './NavBar.css';

function NavBar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        
        {/* IMPROVEMENT 1: Clickable Logo Section */}
        {/* Added cursor-pointer so people know it's clickable */}
        <div 
          className="logo-section" 
          onClick={() => navigate('/homepage')} 
          style={{ cursor: 'pointer' }}
        >
          <img className="logo-pic" src={logoImage} alt="Store Logo" />
          <h2>E-commerce store preview</h2>
        </div>

        <div className="nav-buttons">
          <button onClick={() => navigate('/homepage')}>
            <img className='homeicon' src={homeicon} alt="Home" />
            Home
          </button>

          {/* IMPROVEMENT 2: Dynamic Cart Count */}
          <button onClick={() => navigate('/cart')}>
            <img src={cartImage} alt="Cart" />
            Cart
            {/* Only show the count if there are items */}
            {cartItems.length > 0 && (
              <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                ({cartItems.length})
              </span>
            )}
          </button>

          <button >
            
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
