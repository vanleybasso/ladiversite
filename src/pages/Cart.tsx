import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { updateQuantity, removeFromCart } from "../redux/cartSlice";
import { useTheme } from "../components/ThemeContext";

const Cart: React.FC = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const frete = subtotal >= 300 ? "Grátis" : "R$10,00";
  const taxa = subtotal < 300 ? 10 : 0;
  const total = subtotal + taxa;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      navigate("/listing");
      return;
    }

    if (!isSignedIn) {
      navigate("/login");
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/checkout");
      }, 2000);
    }
  };

  const handleLoginToCheckout = () => {
    navigate("/login");
  };

  const handleIncreaseQuantity = (id: number, currentQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
  };

  const handleDecreaseQuantity = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      <h1
        className={`text-left text-2xl pl-4 pt-6 pb-2 mb-0 flex items-center relative sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}
        style={{ lineHeight: "normal" }}
      >
        <span className={`inline-block text-2xl font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
          Carrinho
        </span>
      </h1>

      <section className={`flex items-center p-4 pl-4 pt-0 pb-4 sm:pl-[174px] ${
        isDarkMode ? "bg-gray-800" : "bg-amber-100"
      }`}>
        <div className="flex items-center">
          <span className={`mr-2 font-bold text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Ecommerce</span>
          <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
          <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Carrinho</span>
        </div>
      </section>

      <main className={`flex flex-col lg:flex-row pl-4 sm:pl-[174px] pr-4 py-10 sm:pr-20 flex-grow ${
        isDarkMode ? "bg-gray-900" : "bg-amber-50"
      }`}>
        <div className="w-full lg:w-2/3 lg:pr-10 mb-6 lg:mb-0">
          <h2 className={`text-base font-semibold mb-4 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Seu carrinho
          </h2>

          <div className={`w-full h-px mb-6 ${isDarkMode ? "bg-gray-700" : "bg-amber-200"}`} />

          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <div className={`text-center py-10 ${isDarkMode ? "text-amber-200" : "text-gray-600"}`}>
                Seu carrinho está vazio
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center">
                  <div className={`w-20 h-20 flex items-center justify-center rounded mb-4 sm:mb-0 sm:mr-4 ${
                    isDarkMode ? "bg-gray-800" : "bg-amber-100"
                  }`}>
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-contain hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <Link to={`/product/${item.id}`} className={`font-medium hover:underline ${
                      isDarkMode ? "text-amber-100" : "text-bordeaux"
                    }`}>
                      {item.title}
                    </Link>
                  </div>
                  <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto">
                    <span className={`font-medium mr-6 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                      R${Number(item.price).toFixed(2)}
                    </span>
                    <div className={`w-[140px] h-[44px] border flex items-center justify-between px-4 ${
                      isDarkMode ? "border-amber-200" : "border-bordeaux"
                    }`}>
                      <img
                        src="/src/assets/Minus.png"
                        alt="Menos"
                        className={`w-5 h-5 cursor-pointer ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                      />
                      <span className={`text-[14px] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>{item.quantity}</span>
                      <img
                        src="/src/assets/Add.png"
                        alt="Mais"
                        className={`w-5 h-5 cursor-pointer ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                      />
                    </div>
                    <div
                      className={`w-[40px] h-[40px] flex items-center justify-center ml-4 rounded-[4px] cursor-pointer ${
                        isDarkMode ? "bg-gray-800" : "bg-amber-100"
                      }`}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <img
                        src="/src/assets/close.png"
                        alt="Remover"
                        className={`w-5 h-5 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`w-full lg:w-1/3 border rounded p-6 h-fit mt-6 lg:mt-0 ${
          isDarkMode ? "border-amber-200 bg-gray-800" : "border-bordeaux bg-amber-50"
        }`}>
          <h2 className={`text-base font-semibold mb-6 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Resumo do Pedido
          </h2>

          <div className={`space-y-4 text-sm ${
            isDarkMode ? "text-amber-200" : "text-gray-700"
          }`}>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className={`font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                R${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span className={`font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                {frete}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Taxa</span>
              <span className={`font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                R${taxa.toFixed(2)}
              </span>
            </div>
            <div className={`border-t pt-4 mb-6 flex justify-between font-medium ${
              isDarkMode ? "border-amber-200 text-amber-100" : "border-bordeaux text-bordeaux"
            }`}>
              <span className={`font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Total</span>
              <span>R${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={isSignedIn ? handleCheckout : handleLoginToCheckout}
            disabled={isLoading || cartItems.length === 0}
            className={`w-full py-3 rounded mt-6 cursor-pointer hover:scale-105 transition-transform duration-200 ${
              isDarkMode
                ? "bg-bordeaux text-amber-50 border border-amber-200"
                : "bg-bordeaux text-amber-50 border border-amber-200"
            } flex items-center justify-center ${(isLoading || cartItems.length === 0) ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
            ) : (
              isSignedIn ? "Finalizar Compra" : "Login para Finalizar"
            )}
          </button>

          <button
            onClick={() => navigate("/listing")}
            className={`w-full text-center text-[12px] mt-4 underline hover:underline cursor-pointer ${
              isDarkMode ? "text-amber-200" : "text-bordeaux"
            }`}
          >
            Continuar Comprando
          </button>
        </div>
      </main>

      <div className={`mt-16 ${isDarkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Cart;