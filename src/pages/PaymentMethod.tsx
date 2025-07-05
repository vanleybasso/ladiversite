import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeContext';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';

const PaymentMethod: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  
  const { order, total } = location.state || {};

  useEffect(() => {
    if (!order || !total) {
      navigate('/cart');
    }
  }, [order, total, navigate]);

  const pixData = {
    merchantName: "Ecommerce Exemplo",
    merchantCity: "São Paulo",
    transactionAmount: total,
    referenceLabel: "Compra #" + Math.floor(Math.random() * 1000000),
    pixKey: "123e4567-e12b-12d1-a456-426655440000" 
  };

  const pixString = JSON.stringify(pixData);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'credit') {
      const cleanedCardNumber = cardNumber.replace(/\s/g, '');
      if (!cleanedCardNumber) {
        newErrors.cardNumber = 'Número do cartão é obrigatório';
      } else if (cleanedCardNumber.length !== 16) {
        newErrors.cardNumber = 'Número do cartão deve ter 16 dígitos';
      } else if (!/^\d+$/.test(cleanedCardNumber)) {
        newErrors.cardNumber = 'Apenas números são permitidos';
      }

      if (!cardName.trim()) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
      } else if (cardName.length < 3) {
        newErrors.cardName = 'Nome muito curto';
      }

      const [month, year] = expiryDate.split('/');
      if (!expiryDate) {
        newErrors.expiryDate = 'Data de expiração é obrigatória';
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Formato inválido (MM/AA)';
      } else {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const expiryYear = parseInt(year, 10);
        const expiryMonth = parseInt(month, 10);

        if (expiryMonth < 1 || expiryMonth > 12) {
          newErrors.expiryDate = 'Mês inválido';
        } else if (
          expiryYear < currentYear || 
          (expiryYear === currentYear && expiryMonth < currentMonth)
        ) {
          newErrors.expiryDate = 'Cartão expirado';
        }
      }

      if (!cvv) {
        newErrors.cvv = 'CVV é obrigatório';
      } else if (!/^\d{3}$/.test(cvv)) {
        newErrors.cvv = 'CVV deve ter 3 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      dispatch(clearCart());

      const saveResponse = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...order,
          date: new Date().toISOString(),
          paymentMethod: paymentMethod === 'credit' ? 'Cartão de Crédito' : 'PIX',
          paymentStatus: 'Concluído'
        }),
      });

      if (saveResponse.ok) {
        navigate('/afterpayment', { 
          state: { 
            order: await saveResponse.json(),
            paymentMethod 
          },
          replace: true
        });
      } else {
        console.error('Falha ao salvar pedido');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return v;
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
          Método de Pagamento
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
        <div className="flex-1 max-w-3xl">
          <h2 className={`text-left text-lg pl-4 pt-4 sm:pl-0 mt-8 text-base font-semibold ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}>
            Escolha o método de pagamento
          </h2>

          <div className={`mt-6 p-6 rounded ${
            isDarkMode ? "bg-gray-800" : "bg-amber-100"
          }`}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit-card"
                  name="payment-method"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                  className="mr-3"
                />
                <label 
                  htmlFor="credit-card" 
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-amber-100" : "text-bordeaux"
                  }`}
                >
                  Cartão de Crédito
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="pix"
                  name="payment-method"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={() => setPaymentMethod('pix')}
                  className="mr-3"
                />
                <label 
                  htmlFor="pix" 
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-amber-100" : "text-bordeaux"
                  }`}
                >
                  PIX (Pagamento Instantâneo)
                </label>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <form onSubmit={handlePaymentSubmit} noValidate autoComplete="on">
                <div className="mb-4 mt-6">
                  <label 
                    htmlFor="card-number" 
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-amber-200" : "text-gray-700"
                    }`}
                  >
                    Número do Cartão
                  </label>
                  <input
                    id="card-number"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    onBlur={() => validateForm()}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    autoComplete="cc-number"
                    className={`w-full h-[45px] p-2 border rounded-md ${
                      isDarkMode ? "bg-gray-700 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                    } ${
                      errors.cardNumber ? (isDarkMode ? "border-red-400" : "border-red-500") : ""
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? "text-red-400" : "text-red-500"
                    }`}>
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label 
                    htmlFor="card-name" 
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-amber-200" : "text-gray-700"
                    }`}
                  >
                    Nome no Cartão
                  </label>
                  <input
                    id="card-name"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="Nome como está no cartão"
                    autoComplete="cc-name"
                    className={`w-full h-[45px] p-2 border rounded-md ${
                      isDarkMode ? "bg-gray-700 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                    } ${
                      errors.cardName ? (isDarkMode ? "border-red-400" : "border-red-500") : ""
                    }`}
                  />
                  {errors.cardName && (
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? "text-red-400" : "text-red-500"
                    }`}>
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label 
                      htmlFor="expiry-date" 
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-amber-200" : "text-gray-700"
                      }`}
                    >
                      Validade
                    </label>
                    <input
                      id="expiry-date"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      onBlur={() => validateForm()}
                      placeholder="MM/AA"
                      maxLength={5}
                      autoComplete="cc-exp"
                      className={`w-full h-[45px] p-2 border rounded-md ${
                        isDarkMode ? "bg-gray-700 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                      } ${
                        errors.expiryDate ? (isDarkMode ? "border-red-400" : "border-red-500") : ""
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? "text-red-400" : "text-red-500"
                      }`}>
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="cvv" 
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-amber-200" : "text-gray-700"
                      }`}
                    >
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      onBlur={() => validateForm()}
                      placeholder="123"
                      maxLength={3}
                      autoComplete="cc-csc"
                      className={`w-full h-[45px] p-2 border rounded-md ${
                        isDarkMode ? "bg-gray-700 border-amber-200 text-amber-50" : "bg-amber-50 border-bordeaux text-gray-800"
                      } ${
                        errors.cvv ? (isDarkMode ? "border-red-400" : "border-red-500") : ""
                      }`}
                    />
                    {errors.cvv && (
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? "text-red-400" : "text-red-500"
                      }`}>
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 rounded mt-6 ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
                  } transition-transform duration-200 ${
                    isDarkMode ? "bg-bordeaux text-amber-50 border border-amber-200" : "bg-bordeaux text-amber-50 border border-amber-200"
                  } flex items-center justify-center`}
                >
                  {isProcessing ? (
                    <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
                  ) : (
                    "Pagar Agora"
                  )}
                </button>
              </form>
            )}

            {paymentMethod === 'pix' && (
              <form onSubmit={handlePaymentSubmit} className="mt-6">
                <div className={`p-4 rounded-md mb-6 ${
                  isDarkMode ? "bg-gray-700" : "bg-amber-50"
                }`}>
                  <h3 className={`text-sm font-semibold mb-4 ${
                    isDarkMode ? "text-amber-100" : "text-bordeaux"
                  }`}>
                    Escaneie o QRCode abaixo para pagar com PIX
                  </h3>
                  
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded ${
                      isDarkMode ? "bg-amber-50" : "bg-white"
                    }`}>
                      <QRCode 
                        value={pixString}
                        size={180}
                        bgColor={isDarkMode ? "#FEF3C7" : "#FFFFFF"}
                        fgColor="#000000"
                        level="Q"
                      />
                    </div>
                  </div>
                  
                  <div className={`text-sm ${
                    isDarkMode ? "text-amber-200" : "text-gray-700"
                  }`}>
                    <p className="mb-2">Valor: <strong>R${total.toFixed(2)}</strong></p>
                    <p className="mb-2">Código da transação: <strong>{pixData.referenceLabel}</strong></p>
                    <p>Pagamento válido por 30 minutos</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 rounded ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
                  } transition-transform duration-200 ${
                    isDarkMode ? "bg-bordeaux text-amber-50 border border-amber-200" : "bg-bordeaux text-amber-50 border border-amber-200"
                  } flex items-center justify-center`}
                >
                  {isProcessing ? (
                    <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
                  ) : (
                    "Já efetuei o pagamento"
                  )}
                </button>
              </form>
            )}
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
                {paymentMethod === 'credit' ? 'Cartão de Crédito' : 'PIX'}
              </span>
            </div>
            <div className={`border-t pt-4 mb-6 flex justify-between font-medium ${
              isDarkMode ? "border-amber-200 text-amber-100" : "border-bordeaux text-bordeaux"
            }`}>
              <span className={`font-semibold ${
                isDarkMode ? "text-amber-100" : "text-bordeaux"
              }`}>Total a pagar</span>
              <span>R${total.toFixed(2)}</span>
            </div>
          </div>

          {paymentMethod === 'pix' && (
            <div className={`mt-4 p-3 rounded text-xs ${
              isDarkMode ? "bg-gray-700 text-amber-200" : "bg-amber-200 text-gray-700"
            }`}>
              <p className="mb-1">✓ Pagamento instantâneo</p>
              <p className="mb-1">✓ Sem taxas adicionais</p>
              <p>✓ Disponível 24/7</p>
            </div>
          )}

          <div className={`mt-6 text-xs ${
            isDarkMode ? "text-amber-300" : "text-gray-500"
          }`}>
            <p className="mb-2">Esta é uma simulação de pagamento. Nenhum dado real será processado.</p>
            <p>Você será redirecionado para a página de confirmação após o "pagamento".</p>
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