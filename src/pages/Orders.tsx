import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext"; 

interface Order {
  userId: string;
  items: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
    imageUrl: string;
  }[];
  total: number;
  originalTotal: number;
  date: string;
  shippingAddress: {
    zipCode: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
  };
  isFirstOrder: boolean;
  discountApplied: number;
}

const Orders: React.FC = () => {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth(); 
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); 

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login"); 
      return;
    }

    const fetchOrders = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:3001/orders?userId=${user.id}`);
        const data = await response.json();

        const sortedOrders = data.sort((a: Order, b: Order) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchOrders();
  }, [user, isLoaded, isSignedIn, navigate]); 

  const handleAccountDetailsClick = () => {
    navigate("/account-details");
  };

  const handleOrdersClick = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleViewItemClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      <h1
        className={`text-left text-2xl pl-4 pt-6 pb-2 mb-0 flex items-center relative sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}
        style={{ lineHeight: "normal" }}
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
          <span className={`mr-2 font-bold text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
            Ecommerce
          </span>
          <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
          <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Minha Conta
          </span>
        </div>
      </section>

      <section className={`flex flex-col md:flex-row items-start sm:pl-[174px] mt-[120px] p-4 sm:p-0 ${
        isDarkMode ? "bg-gray-900" : "bg-amber-50"
      }`}>
        <div className="flex flex-col w-full md:w-auto">
          <section
            className={`flex items-center p-4 cursor-pointer hover:scale-105 transition-transform duration-200 ${
              isDarkMode ? "bg-gray-700" : "bg-amber-100"
            }`}
            style={{ width: "212px", height: "41px", borderRadius: "8px" }}
            onClick={handleOrdersClick}
          >
            <img
              src="/src/assets/car.png"
              alt="Pedidos"
              className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
              style={{ width: "24px", height: "24px" }}
            />
            <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
              Pedidos
            </span>
          </section>

          <section
            className="flex items-center p-4 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={handleAccountDetailsClick}
          >
            <img
              src="/src/assets/user.png"
              alt="Detalhes da Conta"
              className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
              style={{ width: "24px", height: "24px" }}
            />
            <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
              Detalhes da Conta
            </span>
          </section>

          <section
            className="flex items-center p-4 -mt-2 cursor-pointer rounded hover:scale-105 transition-transform duration-200"
            onClick={handleLogout}
          >
            <img
              src="/src/assets/Logout.png"
              alt="Sair"
              className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
              style={{ width: "24px", height: "24px" }}
            />
            <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
              Sair
            </span>
          </section>
        </div>

        <div className={`border-l ${isDarkMode ? "border-gray-700" : "border-amber-200"} h-[504px] mx-4 mt-[-40px] hidden md:block`} />

        <div className="ml-0 md:ml-8 mt-8 md:mt-[-40px] flex flex-col justify-start w-full md:w-auto">
          {orders.length > 0 && (
            <h2 className={`text-base font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
              Pedidos
            </h2>
          )}

          <div style={{ marginTop: "20px" }}>
            {orders.length === 0 ? (
  <div className="flex justify-center items-center flex-col mt-12 sm:mt-16 md:ml-[200px]">
    <img
  src="/src/assets/wine-bottle-solid.svg"
  alt="Nenhum Pedido"
  className="w-16 h-16"
  style={{ filter: "invert(13%) sepia(34%) saturate(3526%) hue-rotate(340deg) brightness(85%) contrast(100%)" }}
/>

    <p className={`text-sm sm:text-base mt-4 text-center ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
      Seu histórico de pedidos está vazio.
    </p>
    <button
      onClick={() => navigate("/listing")}
      className={`bg-bordeaux text-amber-50 py-2 px-6 rounded-md hover:bg-bordeaux-dark cursor-pointer flex items-center gap-2 mt-4 hover:scale-105 transition-transform duration-200 border border-amber-200`}
    >
      Comece a Comprar
      <img
        src="/src/assets/Arrow-Right.png"
        alt="Ícone"
        className="w-6 h-6 filter brightness-0 invert"
      />
    </button>
  </div>
            ) : (
              orders.map((order, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col md:flex-row items-start justify-between mt-4 mb-6 w-full">
                    <div className="flex flex-col md:flex-row items-start flex-grow">
                      <div
                        className={`flex items-center justify-center ${
                          isDarkMode ? "bg-gray-700" : "bg-amber-100"
                        }`}
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <img
                          src={order.items[0]?.imageUrl || "/src/assets/product.png"}
                          alt="Produto"
                          style={{ width: "50px", height: "55px" }}
                        />
                      </div>

                      <div className="ml-0 md:ml-4 flex flex-col justify-start mt-4 md:mt-0 gap-y-2 flex-grow">
                        <h3 className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`} style={{ fontSize: "14px" }}>
                          {order.items[0]?.title || "Nome do Produto"}
                        </h3>
                        <p className={`${isDarkMode ? "text-amber-200" : "text-gray-700"}`} style={{ fontSize: "12px" }}>
                          Pedido em: {new Date(order.date).toLocaleDateString('pt-BR')}
                        </p>
                        {order.isFirstOrder && (
                          <p className={`${isDarkMode ? "text-green-300" : "text-green-600"}`} style={{ fontSize: "12px" }}>
                            Desconto de primeira compra: -R${order.discountApplied.toFixed(2)}
                          </p>
                        )}
                        <p className={`${isDarkMode ? "text-amber-100" : "text-bordeaux"}`} style={{ fontSize: "12px" }}>
                          Total: R${order.total.toFixed(2)}{order.isFirstOrder && (
                            <span className={`${isDarkMode ? "text-amber-200 line-through" : "text-gray-500 line-through"}`} style={{ marginLeft: "8px" }}>
                              R${order.originalTotal.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-center border ${
                        isDarkMode ? "border-amber-200" : "border-bordeaux"
                      } rounded mt-4 md:mt-0 md:ml-40 ml-0 w-full md:w-auto flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200`}
                      style={{
                        width: "100px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                      onClick={() => handleViewItemClick(order.items[0]?.id)}
                    >
                      <span className={`text-sm ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                        Ver Produto
                      </span>
                    </div>
                  </div>

                  {index < orders.length - 1 && (
                    <hr className={`${isDarkMode ? "border-gray-700" : "border-amber-200"}`} style={{ margin: "16px 0" }} />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="mt-30">
        <Footer />
      </div>
    </div>
  );
};

export default Orders;