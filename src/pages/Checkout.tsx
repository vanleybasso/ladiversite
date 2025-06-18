import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { clearCart } from '../redux/cartSlice';
import { useTheme } from '../components/ThemeContext';

const Checkout: React.FC = () => {
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, user } = useUser();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  const [zipCode, setZipCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [zipCodeError, setZipCodeError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const shipping = subtotal >= 300 ? "Grátis" : "R$10,00";
  const shippingCost = subtotal >= 300 ? 0 : 10;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  const validateForm = () => {
    const isZipCodeValid = zipCode.length === 8 && !zipCodeError;
    const isStreetAddressValid = streetAddress.trim() !== '';
    const isCityValid = city.trim() !== '';
    const isStateValid = state.trim() !== '';
    const isCountryValid = country.trim() !== '';

    setIsFormValid(
      isZipCodeValid &&
      isStreetAddressValid &&
      isCityValid &&
      isStateValid &&
      isCountryValid
    );
  };

  useEffect(() => {
    validateForm();
  }, [zipCode, streetAddress, city, state, country, zipCodeError]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const fetchAddress = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setStreetAddress(data.logradouro);
          setCity(data.localidade);
          setState(data.uf);
          setCountry('Brasil');
          setZipCodeError('');
        } else {
          setStreetAddress('');
          setCity('');
          setState('');
          setCountry('Brasil');
          setZipCodeError('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        setZipCodeError('Erro ao consultar CEP. Tente novamente.');
      }
    } else {
      setStreetAddress('');
      setCity('');
      setState('');
      setCountry('Brasil');
      setZipCodeError(cep.length > 0 ? 'CEP incompleto.' : '');
    }
  };

  const handleEditCart = () => {
    navigate('/cart');
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      navigate('/listing');
      return;
    }
  
    if (!user) return;
  
    setIsLoading(true);
  
    
    const response = await fetch(`http://localhost:3001/orders?userId=${user.id}`);
    const userOrders = await response.json();
    const isFirstOrder = userOrders.length === 0;
  
    
    let finalTotal = total;
    let discountApplied = 0;
    
    if (isFirstOrder) {
      discountApplied = subtotal * 0.25;
      finalTotal = total - discountApplied;
    }
  
    const order = {
      userId: user.id,
      items: cartItems,
      total: finalTotal,
      originalTotal: total,
      date: new Date().toISOString(),
      shippingAddress: {
        zipCode,
        streetAddress,
        city,
        state,
        country,
      },
      isFirstOrder
    };
  
    try {
      const saveResponse = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
  
      if (saveResponse.ok) {
        dispatch(clearCart());
        
        navigate('/payment', { state: { total: finalTotal } });
      } else {
        console.error('Falha ao salvar pedido');
      }
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      <h1
        className={`text-left text-2xl pl-4 pt-6 pb-2 mb-0 flex items-center relative sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}
        style={{ lineHeight: 'normal' }}
      >
        <span className={`inline-block text-2xl font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
          Finalização da Compra
        </span>
      </h1>

      <section className={`flex items-center p-4 pl-4 pt-0 pb-4 sm:pl-[174px] ${
        isDarkMode ? "bg-gray-800" : "bg-amber-100"
      }`}>
        <div className="flex items-center">
          <span className={`mr-2 font-bold text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Ecommerce</span>
          <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
          <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Finalização</span>
        </div>
      </section>

      <div className={`flex flex-col lg:flex-row p-4 sm:pl-[174px] gap-8 flex-grow ${
        isDarkMode ? "bg-gray-900" : "bg-amber-50"
      }`}>
        <div className="flex-1">
          <h2 className={`text-left text-lg pl-4 pt-4 sm:pl-0 mt-8 text-base font-semibold ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}>
            Endereço de Entrega
          </h2>

          <div className="pl-4 sm:pl-0 mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-[259px]">
              <label htmlFor="zip-code" className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-amber-200" : "text-gray-700"
              }`}>
                CEP
              </label>
              <input
                id="zip-code"
                type="text"
                value={zipCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setZipCode(value);
                  fetchAddress(value);
                }}
                className={`w-full h-[45px] p-2 border rounded-md ${
                  isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                }`}
                style={{ fontSize: '14px' }}
                maxLength={8}
              />
              {zipCodeError && <p className="text-red-400 text-sm mt-1">{zipCodeError}</p>}
            </div>

            <div className="w-full sm:w-[259px]">
              <label htmlFor="country" className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-amber-200" : "text-gray-700"
              }`}>
                País
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full h-[45px] p-2 border rounded-md ${
                  isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                }`}
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="pl-4 sm:pl-0 mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-[259px]">
              <label htmlFor="city" className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-amber-200" : "text-gray-700"
              }`}>
                Cidade
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full h-[45px] p-2 border rounded-md ${
                  isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                }`}
                style={{ fontSize: '14px' }}
              />
            </div>

            <div className="w-full sm:w-[259px]">
              <label htmlFor="state" className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-amber-200" : "text-gray-700"
              }`}>
                Estado
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`w-full h-[45px] p-2 border rounded-md ${
                  isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                }`}
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="pl-4 sm:pl-0 mt-8">
            <label htmlFor="street-address" className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? "text-amber-200" : "text-gray-700"
            }`}>
              Endereço
            </label>
            <input
              id="street-address"
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className={`w-full lg:w-[534px] h-[45px] p-2 border rounded-md ${
                isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
              }`}
              style={{ fontSize: '14px' }}
            />
          </div>

          <div className="pl-4 sm:pl-0 mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-[259px]">
              <label htmlFor="full-name" className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-amber-200" : "text-gray-700"
              }`}>
                Nome Completo
              </label>
              <input
                id="full-name"
                type="text"
                value={user?.fullName || ''}
                readOnly
                className={`w-full h-[45px] p-2 border rounded-md ${
                  isDarkMode ? "bg-gray-800 border-amber-200 text-amber-100 cursor-default" : "bg-amber-100 border-bordeaux text-gray-700 cursor-default"
                }`}
                style={{ fontSize: '14px' }}
              />
            </div>

            <div className="w-full sm:w-[259px]">
              <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? "text-amber-200" : "text-gray-700"
              }`}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.primaryEmailAddress?.emailAddress || ''}
                readOnly
                className={`w-full h-[45px] p-2 border rounded-md ${
                  isDarkMode ? "bg-gray-800 border-amber-200 text-amber-100 cursor-default" : "bg-amber-100 border-bordeaux text-gray-700 cursor-default"
                }`}
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        </div>

        <div
          className="hidden lg:block"
          style={{
            width: '1px',
            height: '504px',
            backgroundColor: isDarkMode ? '#4A5568' : '#E6E7E8',
            marginLeft: '32px',
            marginTop: '32px',
          }}
        ></div>

        <div className={`w-full lg:w-1/3 p-6 h-fit lg:mr-[174px] mt-8 border rounded ${
          isDarkMode ? "border-amber-200 bg-gray-800" : "border-bordeaux bg-amber-50"
        }`}>
          <h2 className={`text-base font-semibold mb-10 ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}>
            Seu Pedido
          </h2>

          <div className="w-full flex justify-end mb-16">
            <div
              className={`border rounded-[4px] flex items-center justify-center w-[107px] h-[44px] cursor-pointer hover:scale-105 transition-transform duration-200 ${
                isDarkMode ? "border-amber-200" : "border-bordeaux"
              }`}
              onClick={handleEditCart}
            >
              <span className={`text-sm ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`} style={{ fontSize: '14px' }}>
                Editar Carrinho
              </span>
            </div>
          </div>

          <div className={`space-y-4 text-sm ${
            isDarkMode ? "text-amber-200" : "text-gray-700"
          }`}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className={`font-semibold ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`}>R${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span className={`font-semibold ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`}>{shipping}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa</span>
              <span className={`font-semibold ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`}>R${tax.toFixed(2)}</span>
            </div>
            <div className={`border-t pt-4 mb-6 flex justify-between font-medium ${
              isDarkMode ? "border-amber-200 text-amber-100" : "border-bordeaux text-bordeaux"
            }`}>
              <span className={`font-semibold ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`}>Total</span>
              <span>R${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 rounded mt-6 ${
              isFormValid ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'
            } transition-transform duration-200 ${
              isDarkMode ? "bg-bordeaux text-amber-50 border border-amber-200" : "bg-bordeaux text-amber-50 border border-amber-200"
            } flex items-center justify-center`}
          >
            {isLoading ? (
              <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
            ) : (
              "Finalizar Compra"
            )}
          </button>
        </div>
      </div>

      <div className={`mt-16 ${isDarkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Checkout;