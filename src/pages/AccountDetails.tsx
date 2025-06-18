import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { useTheme } from '../components/ThemeContext';

const AccountDetails: React.FC = () => {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth(); 
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login'); 
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleLogout = async () => {
    await signOut();
    dispatch(clearCart());
    localStorage.removeItem('cartState');
    navigate('/login');
  };

  const handleOrdersClick = () => {
    navigate('/orders');
  };

  const handleAccountDetailsClick = () => {
    window.location.reload();
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
        <span className={`inline-block font-bold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
          Minha Conta
        </span>
      </h1>

      <section
        className={`flex items-center p-4 pt-0 pb-4 sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}
      >
        <div className="flex items-center">
          <span className={`mr-2 font-semibold text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
            Ecommerce
          </span>
          <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
          <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Minha Conta
          </span>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-start sm:pl-[174px] mt-[120px] p-4 sm:p-0">
        <div className="flex flex-col w-full md:w-auto">
          <section
            onClick={handleOrdersClick}
            className={`flex items-center p-4 cursor-pointer hover:scale-105 transition-transform duration-200 ${
              isDarkMode ? "text-amber-200" : "text-gray-700"
            }`}
          >
            <img
              src="/src/assets/car.png"
              alt="Pedidos"
              className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
            />
            <span className="text-sm font-semibold">Pedidos</span>
          </section>

          <section
            onClick={handleAccountDetailsClick}
            className={`flex items-center p-4 cursor-pointer hover:scale-105 transition-transform duration-200 ${
              isDarkMode ? "bg-gray-700" : "bg-amber-100"
            }`}
            style={{ width: '212px', height: '41px', borderRadius: '8px' }}
          >
            <img
              src="/src/assets/user3.png"
              alt="Detalhes da Conta"
              className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
              style={{ width: '24px', height: '24px' }}
            />
            <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
              Detalhes da Conta
            </span>
          </section>

          <section
            onClick={handleLogout}
            className="flex items-center p-4 cursor-pointer rounded hover:scale-105 transition-transform duration-200"
          >
            <img
              src="/src/assets/Logout.png"
              alt="Sair"
              className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
            />
            <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
              Sair
            </span>
          </section>
        </div>

        <div className={`border-l ${isDarkMode ? "border-gray-700" : "border-amber-200"} h-[504px] mx-4 mt-[-40px] hidden md:block`} />

        <div className="ml-0 md:ml-8 mt-8 md:mt-[-40px] flex flex-col justify-start w-full md:w-auto">
          <h2 className={`text-base font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Detalhes da Conta
          </h2>

          <div
            className="mt-10 flex justify-center items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: isDarkMode ? '#374151' : '#F0F1FF',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
            onClick={() => alert('Avatar clicado!')}
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Perfil do Usuário"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${
                isDarkMode ? "bg-gray-600" : "bg-amber-200"
              }`}>
                <span className={`text-lg font-semibold ${
                  isDarkMode ? "text-amber-100" : "text-bordeaux"
                }`}>
                  {user?.firstName ? user.firstName[0] : 'U'}
                </span>
              </div>
            )}
          </div>

          <label className={`text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"} mt-8`}>
            Nome Completo
          </label>
          <input
            type="text"
            value={user?.fullName || ''}
            readOnly
            className={`mt-2 w-[320px] h-[44px] border ${
              isDarkMode ? "border-amber-200 bg-gray-700 text-amber-50" : "border-bordeaux bg-amber-100"
            } rounded-[6px] px-4 py-2 text-sm cursor-not-allowed`}
          />

          <label className={`text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"} mt-6`}>
            Email
          </label>
          <input
            type="email"
            value={user?.primaryEmailAddress?.emailAddress || ''}
            readOnly
            className={`mt-2 w-[320px] h-[44px] border ${
              isDarkMode ? "border-amber-200 bg-gray-700 text-amber-50" : "border-bordeaux bg-amber-100"
            } rounded-[6px] px-4 py-2 text-sm cursor-not-allowed`}
          />
        </div>
      </section>

      <div className="mt-30">
        <Footer />
      </div>
    </div>
  );
};

export default AccountDetails;