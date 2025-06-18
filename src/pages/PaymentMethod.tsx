import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeContext';
import { useUser } from '@clerk/clerk-react';

const PaymentMethod: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  
  const [selectedMethod, setSelectedMethod] = useState<'credit-card' | 'pix' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMethodChange = (method: 'credit-card' | 'pix') => {
    setSelectedMethod(method);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação do número do cartão
    if (name === 'number') {
      const formattedValue = value
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    
    if (name === 'expiry') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirecionar para página de confirmação
      navigate('/afterpayment');
    } catch (error) {
      console.error('Erro no processamento do pagamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCheckout = () => {
    navigate('/checkout');
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
          Forma de Pagamento
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
            Pagamento
          </span>
        </div>
      </section>

      <div className={`flex flex-col lg:flex-row p-4 sm:pl-[174px] gap-8 flex-grow ${
        isDarkMode ? "bg-gray-900" : "bg-amber-50"
      }`}>
        <div className="flex-1">
          <h2 className={`text-left text-lg pl-4 pt-4 sm:pl-0 mt-8 text-base font-semibold ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}>
            Selecione o método de pagamento
          </h2>

          <div className="pl-4 sm:pl-0 mt-8">
            <div 
              className={`p-4 mb-4 border rounded cursor-pointer transition-all duration-200 ${
                selectedMethod === 'credit-card' 
                  ? isDarkMode 
                    ? 'border-amber-200 bg-gray-800' 
                    : 'border-bordeaux bg-amber-100'
                  : isDarkMode 
                    ? 'border-gray-700 hover:border-amber-200' 
                    : 'border-amber-200 hover:border-bordeaux'
              }`}
              onClick={() => handleMethodChange('credit-card')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={selectedMethod === 'credit-card'}
                  onChange={() => handleMethodChange('credit-card')}
                  className="mr-3"
                />
                <span className={`font-semibold ${
                  isDarkMode ? "text-amber-100" : "text-bordeaux"
                }`}>Cartão de Crédito</span>
                <div className="ml-auto flex">
                  <img 
                    src="/src/assets/visa.png" 
                    alt="Visa" 
                    className="w-8 h-5 mx-1" 
                  />
                  <img 
                    src="/src/assets/mastercard.png" 
                    alt="Mastercard" 
                    className="w-8 h-5 mx-1" 
                  />
                  <img 
                    src="/src/assets/amex.png" 
                    alt="Amex" 
                    className="w-8 h-5 mx-1" 
                  />
                </div>
              </div>

              {selectedMethod === 'credit-card' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className={`block text-sm mb-2 ${
                      isDarkMode ? "text-amber-200" : "text-gray-700"
                    }`}>Número do Cartão</label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full p-2 border rounded-md ${
                        isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm mb-2 ${
                      isDarkMode ? "text-amber-200" : "text-gray-700"
                    }`}>Nome no Cartão</label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardInputChange}
                      placeholder={user?.fullName || 'Nome como no cartão'}
                      className={`w-full p-2 border rounded-md ${
                        isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                      }`}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className={`block text-sm mb-2 ${
                        isDarkMode ? "text-amber-200" : "text-gray-700"
                      }`}>Validade</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardInputChange}
                        placeholder="MM/AA"
                        maxLength={5}
                        className={`w-full p-2 border rounded-md ${
                          isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className={`block text-sm mb-2 ${
                        isDarkMode ? "text-amber-200" : "text-gray-700"
                      }`}>CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full p-2 border rounded-md ${
                          isDarkMode ? "bg-gray-800 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              className={`p-4 border rounded cursor-pointer transition-all duration-200 ${
                selectedMethod === 'pix' 
                  ? isDarkMode 
                    ? 'border-amber-200 bg-gray-800' 
                    : 'border-bordeaux bg-amber-100'
                  : isDarkMode 
                    ? 'border-gray-700 hover:border-amber-200' 
                    : 'border-amber-200 hover:border-bordeaux'
              }`}
              onClick={() => handleMethodChange('pix')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={selectedMethod === 'pix'}
                  onChange={() => handleMethodChange('pix')}
                  className="mr-3"
                />
                <span className={`font-semibold ${
                  isDarkMode ? "text-amber-100" : "text-bordeaux"
                }`}>PIX</span>
                <img 
                  src="/src/assets/pix.png" 
                  alt="PIX" 
                  className="w-8 h-8 ml-auto" 
                />
              </div>

              {selectedMethod === 'pix' && (
                <div className="mt-4">
                  <p className={`text-sm ${
                    isDarkMode ? "text-amber-200" : "text-gray-700"
                  }`}>
                    Ao selecionar PIX, você receberá um QR Code para pagamento instantâneo.
                    Seu pedido será confirmado automaticamente após a confirmação do pagamento.
                  </p>
                </div>
              )}
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
          <h2 className={`text-base font-semibold mb-6 ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}>
            Resumo do Pedido
          </h2>

          <div className={`space-y-4 text-sm ${
            isDarkMode ? "text-amber-200" : "text-gray-700"
          }`}>
            <div className="flex justify-between">
              <span>Método selecionado</span>
              <span className={`font-semibold ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`}>
                {selectedMethod === 'credit-card' ? 'Cartão de Crédito' : 
                 selectedMethod === 'pix' ? 'PIX' : 'Nenhum'}
              </span>
            </div>
            
            {selectedMethod === 'pix' && (
              <div className={`p-3 rounded ${
                isDarkMode ? "bg-gray-700 text-amber-100" : "bg-amber-100 text-bordeaux"
              }`}>
                <p className="text-sm font-semibold">5% de desconto no PIX!</p>
              </div>
            )}
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleBackToCheckout}
              className={`flex-1 py-2 rounded border ${
                isDarkMode ? "border-amber-200 text-amber-100 hover:bg-gray-700" : "border-bordeaux text-bordeaux hover:bg-amber-100"
              } transition-colors duration-200`}
            >
              Voltar
            </button>
            <button
              onClick={handleSubmitPayment}
              disabled={!selectedMethod || isProcessing}
              className={`flex-1 py-2 rounded ${
                selectedMethod 
                  ? 'hover:scale-105 cursor-pointer bg-bordeaux text-amber-50 border border-amber-200' 
                  : 'opacity-50 cursor-not-allowed bg-bordeaux text-amber-50'
              } transition-all duration-200 flex items-center justify-center`}
            >
              {isProcessing ? (
                <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
              ) : (
                "Confirmar Pagamento"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`mt-16 ${isDarkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default PaymentMethod;