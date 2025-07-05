import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext"; 

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  imageUrl: string;
  review?: Review;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
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
  paymentMethod: string;
  paymentStatus: string;
}

const Orders: React.FC = () => {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth(); 
  const { signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [editingReview, setEditingReview] = useState<{
    orderId: string;
    itemIndex: number;
    rating: number;
    comment: string;
  } | null>(null);

  const [ratingError, setRatingError] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login"); 
      return;
    }

    const fetchOrders = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/orders?userId=${user.id}`);
        const data = await response.json();

        const sortedOrders = data.sort((a: Order, b: Order) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setIsLoading(false);
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

  const handleReviewClick = (orderId: string, itemIndex: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const item = order.items[itemIndex];
    
    setEditingReview({
      orderId,
      itemIndex,
      rating: item.review?.rating || 0,
      comment: item.review?.comment || ""
    });
    setRatingError(false);
  };

  const handleRatingChange = (rating: number) => {
    if (editingReview) {
      setEditingReview({
        ...editingReview,
        rating
      });
      setRatingError(false);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingReview) {
      setEditingReview({
        ...editingReview,
        comment: e.target.value
      });
    }
  };

  const submitReview = async () => {
    if (!editingReview || !user) return;

    // Validação da nota
    if (editingReview.rating === 0) {
      setRatingError(true);
      return;
    }

    try {
      const { orderId, itemIndex, rating, comment } = editingReview;
      
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) return;

      const order = orders[orderIndex];
      const updatedOrder = { ...order };
      
      updatedOrder.items = [...updatedOrder.items];
      updatedOrder.items[itemIndex] = {
        ...updatedOrder.items[itemIndex],
        review: {
          rating,
          comment,
          date: new Date().toISOString(),
          reviewerName: user.fullName || "Anônimo"
        }
      };

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = updatedOrder;
      setOrders(updatedOrders);

      await fetch(`http://localhost:3001/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      setEditingReview(null);
      setRatingError(false);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  const cancelReview = () => {
    setEditingReview(null);
    setRatingError(false);
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
          {!isLoading && orders.length > 0 && (
            <h2 className={`text-base font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
              Pedidos
            </h2>
          )}

          <div style={{ marginTop: "20px" }}>
            {isLoading ? (
              <div className="flex justify-center items-center flex-col mt-12 sm:mt-16 md:ml-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bordeaux"></div>
                <p className={`text-sm sm:text-base mt-4 text-center ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                  Carregando seus pedidos...
                </p>
              </div>
            ) : orders.length === 0 ? (
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
              orders.map((order, orderIndex) => (
                <div key={order.id} className="mb-8">
                  <div className={`p-4 rounded-t ${isDarkMode ? "bg-gray-800" : "bg-amber-100"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                          Pedido #{order.id.substring(0, 6).toUpperCase()}
                        </p>
                        <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-600"}`}>
                          Data: {new Date(order.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-600"}`}>
                          Total: R${order.total.toFixed(2)}
                        </p>
                        <p className={`text-xs ${isDarkMode ? "text-green-300" : "text-green-600"}`}>
                          Status: {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} border ${isDarkMode ? "border-gray-700" : "border-amber-200"} rounded-b`}>
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-6 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0 border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start mb-4 md:mb-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-16 h-16 object-cover mr-4 rounded"
                            />
                            <div>
                              <h4 className={`text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                                {item.title}
                              </h4>
                              <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-600"}`}>
                                Quantidade: {item.quantity} | R${item.price.toFixed(2)} cada
                              </p>
                              <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-600"}`}>
                                Tamanho: {item.selectedSize} | Cor: {item.selectedColor}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <button
                              onClick={() => handleViewItemClick(item.id)}
                              className={`mb-2 px-3 py-1 rounded text-sm w-full md:w-32 cursor-pointer ${
                                isDarkMode 
                                  ? "bg-gray-700 hover:bg-gray-600 text-amber-100 border-gray-600" 
                                  : "bg-amber-100 hover:bg-amber-200 text-bordeaux border-amber-200"
                              } border`}
                            >
                              Ver produto
                            </button>

                            {item.review ? (
                              <div className={`p-3 rounded ${isDarkMode ? "bg-gray-700" : "bg-amber-50"} w-full md:w-64`}>
                                <div className="flex items-center mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-lg ${i < item.review.rating ? 'text-yellow-400' : 'text-gray-400'}`}>
                                      ★
                                    </span>
                                  ))}
                                  <span className={`text-xs ml-2 ${isDarkMode ? "text-amber-200" : "text-gray-500"}`}>
                                    {item.review.rating}.0
                                  </span>
                                </div>
                                {item.review.comment && (
                                  <p className={`text-xs ${isDarkMode ? "text-amber-100" : "text-gray-800"} mb-1 break-words whitespace-normal max-w-full`}>
                                    "{item.review.comment}"
                                  </p>
                                )}
                                <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-500"}`}>
                                  Avaliado em: {new Date(item.review.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleReviewClick(order.id, itemIndex)}
                                className={`px-3 py-1 rounded text-sm w-full md:w-32 cursor-pointer transition-transform duration-200 hover:scale-105 border ${
                                  isDarkMode 
                                    ? "bg-amber-600 hover:bg-amber-700 text-amber-50 border-amber-500" 
                                    : "bg-bordeaux hover:bg-bordeaux-dark text-amber-50 border-bordeaux"
                                }`}
                              >
                                Avaliar produto
                              </button>
                            )}
                          </div>
                        </div>

                        {editingReview?.orderId === order.id && editingReview?.itemIndex === itemIndex && (
                          <div className={`mt-4 p-4 rounded ${isDarkMode ? "bg-gray-700" : "bg-amber-100"}`}>
                            <h5 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                              Avalie este produto
                            </h5>
                            <div className="flex items-start mb-3">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => handleRatingChange(star)}
                                    className="text-2xl focus:outline-none cursor-pointer"
                                  >
                                    <span className={star <= (editingReview?.rating || 0) ? 'text-yellow-400' : 'text-gray-400'}>
                                      ★
                                    </span>
                                  </button>
                                ))}
                              </div>
                              <span className={`ml-2 text-sm mt-[6px] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                                {editingReview?.rating}.0
                              </span>
                            </div>
                            {ratingError && (
                              <p className={`text-xs mb-3 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                                Por favor, selecione uma nota para avaliar este produto.
                              </p>
                            )}
                            <textarea
                              value={editingReview?.comment || ""}
                              onChange={handleCommentChange}
                              placeholder="Deixe seu comentário (opcional)"
                              className={`w-full p-2 rounded text-sm mb-3 ${
                                isDarkMode 
                                  ? "bg-gray-600 text-amber-100 border-gray-500" 
                                  : "bg-white text-gray-800 border-amber-200"
                              } border`}
                              rows={3}
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={cancelReview}
                                className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                  isDarkMode 
                                    ? "bg-gray-600 hover:bg-gray-500 text-amber-100" 
                                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                                }`}
                              >
                                Cancelar
                              </button>

                              <button
                                onClick={submitReview}
                                className={`px-3 py-1 rounded text-sm cursor-pointer ${
                                  isDarkMode 
                                    ? "bg-amber-600 hover:bg-amber-500 text-amber-50" 
                                    : "bg-bordeaux hover:bg-bordeaux-dark text-amber-50"
                                } ${!editingReview?.rating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!editingReview?.rating}
                              >
                                Enviar Avaliação
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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