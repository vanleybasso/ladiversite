import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useUser } from "@clerk/clerk-react"; 
import { useSelector } from "react-redux"; 
import { RootState } from "../redux/store"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { isSignedIn } = useUser(); 
  const cartItems = useSelector((state: RootState) => state.cart.items); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      if (error) setError("");
      if (success) setSuccess("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, success]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Por favor, insira um endereço de e-mail válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Falha na inscrição");
      }

      setSuccess("Inscrito com sucesso!");
      setEmail("");
    } catch (error) {
      console.error("Erro na inscrição:", error);
      setError("Não foi possível realizar sua inscrição no momento. Por favor, tente novamente mais tarde.");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAccountClick = () => {
    if (!isSignedIn) {
      navigate("/login"); 
    } else {
      navigate("/account-details"); 
    }
  };

  const handleCheckoutClick = () => {
    if (!isSignedIn) {
      navigate("/login"); 
    } else if (cartItems.length === 0) {
      navigate("/listing"); 
    } else {
      navigate("/checkout"); 
    }
  };

  return (
    <footer className={`${isDarkMode ? "bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      {/* Newsletter Section */}
      <div className={`${isDarkMode ? "bg-bordeaux-dark" : "bg-bordeaux"} py-8`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-1/2 md:pl-[40px]">
            <h2 className={`text-xl font-bold mb-2 md:mb-4 ${isDarkMode ? "text-amber-100" : "text-amber-50"}`}>
              Assine nossa newsletter
            </h2>
            <p className={`mb-4 md:mb-6 text-sm ${isDarkMode ? "text-amber-100" : "text-amber-100"}`}>
              Receba ofertas exclusivas e novidades sobre nossos importados premium.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col items-center gap-2 md:w-1/2">
            <div className="w-full flex justify-center gap-2">
              <input
                type="text"
                placeholder="Seu endereço de e-mail"
                aria-invalid={!!error}
                className={`px-4 py-2 border ${
                  error ? "border-red-500" : isDarkMode ? "border-amber-200" : "border-amber-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-2/3 placeholder-gray-400 ${
                  isDarkMode ? "bg-bordeaux text-amber-50" : "bg-amber-50"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-amber-600 text-amber-50 rounded-lg hover:bg-amber-700 hover:scale-105 transition-all duration-300 text-sm cursor-pointer border border-amber-400"
              >
                Assinar
              </button>
            </div>

            <div className="h-6">
              {error && <p className="text-red-300 text-sm mt-2 animate-fadeIn">{error}</p>}
              {success && <p className="text-green-300 text-sm mt-2 animate-fadeIn">{success}</p>}
            </div>
          </form>
        </div>
      </div>

     
      <div className={`${isDarkMode ? "bg-gray-900" : "bg-amber-50"} py-8`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:pl-[50px]">
          
          <div>
            <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
              <img
                src={isDarkMode ? "/src/assets/logo-favicon2.svg" : "/src/assets/beer.png"}
                alt="Logo"
                className="h-10 mr-2"
              />
              <span className={`text-lg font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                La Diversité
              </span>
            </div>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
              Os melhores vinhos e destilados importados, <br /> selecionados para os paladares mais refinados.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-110"
              >
                <img
                  src="/src/assets/github.png"
                  alt="GitHub"
                  className="h-6"
                  style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
                />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-110"
              >
                <img
                  src="/src/assets/instagram.png"
                  alt="Instagram"
                  className="h-6"
                  style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
                />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-110"
              >
                <img
                  src="/src/assets/youtube.png"
                  alt="YouTube"
                  className="h-6"
                  style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
                />
              </a>
            </div>
          </div>

         
          <div className="grid grid-cols-3 gap-18 mt-6 md:mt-0">
            
            <div>
              <h3 className={`text-lg font-semibold mb-5 text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"} hover:text-bordeaux transition-colors duration-200`}>
                SUPORTE
              </h3>
              <ul className={`text-sm space-y-2 ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
                <li>
                  <Link 
                    to="/faq" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>

           
            <div>
              <h3 className={`text-lg font-semibold mb-5 text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"} hover:text-bordeaux transition-colors duration-200`}>
                EMPRESA
              </h3>
              <ul className={`text-sm space-y-2 ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
                <li>
                  <Link 
                    to="/about" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/careers" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    Carreiras
                  </Link>
                </li>
              </ul>
            </div>

           
            <div>
              <h3 className={`text-lg font-semibold mb-5 text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"} hover:text-bordeaux transition-colors duration-200`}>
                LOJA
              </h3>
              <ul className={`text-sm space-y-2 ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
                <li>
                  <button
                    onClick={handleAccountClick} 
                    className="hover:text-bordeaux transition-colors duration-200 text-left w-full cursor-pointer"
                  >
                    Minha Conta
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleCheckoutClick} 
                    className="hover:text-bordeaux transition-colors duration-200 text-left w-full cursor-pointer"
                  >
                    Finalizar Compra
                  </button>
                </li>
                <li>
                  <Link 
                    to="/cart" 
                    className="hover:text-bordeaux transition-colors duration-200"
                  >
                    Carrinho
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          
          <div className="mt-6 md:mt-0">
            <h3 className={`font-semibold mb-8 text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
              PAGAMENTOS ACEITOS
            </h3>
            <div className="flex gap-8">
              <img
                src="/src/assets/Mastercard.png"
                alt="MasterCard"
                className="h-6"
                style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
              />
              <img
                src="/src/assets/Amex.png"
                alt="Amex"
                className="h-6"
                style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
              />
              <img
                src="/src/assets/Visa.png"
                alt="Visa"
                className="h-6"
                style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
              />
            </div>
          </div>
        </div>

        
        <div className={`text-center mt-30 mb-0 text-sm ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
          © {currentYear} La Diversité. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;