import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeContext';

const AfterPayment: React.FC = () => {
  const navigate = useNavigate(); 
  const { isDarkMode } = useTheme();

  const handleGoToAccount = () => {
    navigate('/orders');
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      <h1
        className={`text-left text-2xl pl-4 pt-6 pb-2 mb-0 flex items-center relative sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}
        style={{ lineHeight: 'normal' }}
      >
        <span className={`inline-block font-semibold ${
          isDarkMode ? "text-amber-100" : "text-bordeaux"
        }`}>
          Pedido Confirmado
        </span>
      </h1>

      <section
        className={`flex items-center p-4 pl-4 pt-0 pb-4 sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}
      >
        <div className="flex items-center">
          <span className={`mr-2 font-bold text-sm ${
            isDarkMode ? "text-amber-200" : "text-bordeaux"
          }`}>
            Ecommerce
          </span>
          <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
          <span className={`text-sm font-semibold ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}>
            Pedido Confirmado
          </span>
        </div>
      </section>

      <section className="flex justify-center py-8 mt-[179px]">
        <img
          src="/src/assets/Group.png"
          alt="Imagem de sucesso"
          className={`max-w-full h-auto ${isDarkMode ? "filter brightness-0 invert" : ""}`}
        />
      </section>

      <section className="flex justify-center mt-2">
        <h2 className={`text-2xl font-bold ${
          isDarkMode ? "text-amber-100" : "text-bordeaux"
        }`}>
          Obrigado por comprar conosco
        </h2>
      </section>

      <section className="flex justify-center mt-4">
        <p className={`text-center ${
          isDarkMode ? "text-amber-200" : "text-gray-700"
        }`} style={{ fontSize: '14px' }}>
          Seu pedido foi confirmado com sucesso e está<br />
          sendo processado.
        </p>
      </section>

      <section className="flex justify-center mt-10">
        <button
          onClick={handleGoToAccount}
          className={`bg-bordeaux text-amber-50 py-2 px-6 rounded-md hover:bg-bordeaux-dark cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform duration-200 border border-amber-200`}
        >
          Ir para meus pedidos
          <img
            src="/src/assets/Arrow-Right.png" 
            alt="Ícone"
            className="w-6 h-6 filter brightness-0 invert" 
          />
        </button>
      </section>

      <div className="mt-30">
        <Footer />
      </div>
    </div>
  );
};

export default AfterPayment;