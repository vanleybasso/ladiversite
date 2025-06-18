import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useTheme } from "./ThemeContext"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isDarkMode } = useTheme();

  const totalItemsInCart = cartItems.length;

  const handleUserIconClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/account-details");
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className={`w-full ${isDarkMode ? "bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
     
      <div className={`${isDarkMode ? "bg-bordeaux-dark" : "bg-bordeaux"} text-amber-100 text-center py-2 text-sm`}>
        Ganhe 25% de desconto no seu primeiro pedido.{" "}
        <Link to="/listing" className="underline hover:text-amber-200 transition-colors duration-200">
          Compre agora
        </Link>
      </div>

    
      <nav className="flex justify-between items-center p-4 shadow-md relative">
        
        <div className="md:hidden ml-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mt-2 focus:outline-none cursor-pointer"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${isDarkMode ? "text-amber-100" : "text-bordeaux"} hover:scale-110 transition-transform duration-200`} />
            ) : (
              <Menu className={`w-6 h-6 ${isDarkMode ? "text-amber-100" : "text-bordeaux"} hover:scale-110 transition-transform duration-200`} />
            )}
          </button>
        </div>

    
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <img 
            src={isDarkMode ? "/src/assets/logo-favicon2.svg" : "/src/assets/beer.png"} 
            alt="Logo" 
            className="h-8 hover:scale-105 transition-transform duration-200" 
          />
          <span className={`text-lg font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"} hover:text-amber-500 transition-colors duration-200`}>
            La Diversité
          </span>
        </div>

      
        <ul className="hidden md:flex gap-8 flex-grow justify-center">
          <li>
            <Link
              to="/"
              className={`relative group ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? "bg-amber-300" : "bg-bordeaux-dark"} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/listing"
              className={`relative group ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}
            >
              Loja
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? "bg-amber-300" : "bg-bordeaux-dark"} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`relative group ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}
            >
              Sobre
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkMode ? "bg-amber-300" : "bg-bordeaux-dark"} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
          </li>
        </ul>

       
        <div className="flex gap-4 md:ml-auto mr-4 items-center">
         
          <div
            className="relative cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={handleCartClick}
          >
            <ShoppingCart 
              className={`w-6 h-6 ${isDarkMode ? "text-amber-100" : "text-bordeaux"} hover:text-bordeaux-dark transition-colors duration-200`}
            />
            {totalItemsInCart > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center w-5 h-5 bg-bordeaux"
              >
                {totalItemsInCart}
              </span>
            )}
          </div>

          
          {user ? (
            <div
              onClick={handleUserIconClick}
              className="w-6 h-6 rounded-full bg-bordeaux flex items-center justify-center text-sm font-semibold cursor-pointer overflow-hidden transform transition-transform duration-300 hover:scale-110 hover:shadow-md "
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User Profile"
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200"
                />
              ) : (
                <User className="w-4 h-4 text-amber-100" />
              )}
            </div>
          ) : (
            <div
              className="transform transition-transform duration-300 hover:scale-110"
              onClick={handleUserIconClick}
            >
              <User 
                className={`w-6 h-6 ${isDarkMode ? "text-amber-100" : "text-bordeaux"} hover:text-bordeaux-dark transition-colors duration-200`}
              />
            </div>
          )}
        </div>
      </nav>

      
      {isMenuOpen && (
        <ul className={`md:hidden flex flex-col items-center shadow-md py-2 absolute w-full z-10 ${
          isDarkMode ? "bg-gray-800 text-amber-100" : "bg-amber-100 text-bordeaux"
        }`}>
          <li className="w-full">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 w-full text-center relative overflow-hidden ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-amber-200"
              } transition-colors duration-200`}
            >
              <span className="relative z-10">Home</span>
              <span className={`absolute inset-0 ${
                isDarkMode ? "bg-amber-500" : "bg-bordeaux"
              } opacity-0 hover:opacity-10 transition-opacity duration-300`}></span>
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/listing"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 w-full text-center relative overflow-hidden ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-amber-200"
              } transition-colors duration-200`}
            >
              <span className="relative z-10">Loja</span>
              <span className={`absolute inset-0 ${
                isDarkMode ? "bg-amber-500" : "bg-bordeaux"
              } opacity-0 hover:opacity-10 transition-opacity duration-300`}></span>
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-3 w-full text-center relative overflow-hidden ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-amber-200"
              } transition-colors duration-200`}
            >
              <span className="relative z-10">Sobre</span>
              <span className={`absolute inset-0 ${
                isDarkMode ? "bg-amber-500" : "bg-bordeaux"
              } opacity-0 hover:opacity-10 transition-opacity duration-300`}></span>
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;