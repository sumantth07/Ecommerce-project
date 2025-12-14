import { Routes, Route} from 'react-router-dom';
import NavBar from './NavBar.jsx'
import Products from './products.jsx';
import Example from './HeroSection.jsx';
import Cart from './cart.jsx';
 
 
export default function App(){

  
    return(
   <>
      
      
      <Routes>
        <Route index element={<Example/>}/>
        <Route path="/homepage"  element= { <><NavBar /> <Products/></>} />
        <Route path="/cart"    element ={<><NavBar /> <Cart/></>}/>
      </Routes>
    </>
  )
}