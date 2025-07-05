import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import ImageCarousel from "../components/ImageCarousel";
import { useTheme } from "../components/ThemeContext";

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface OrderItem {
  id: string;
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

interface Product {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  price: string;
  status: string;
  rating: number;
  reviewsCount: number;
  description: string;
  images: string[];
  category: string;
}

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        document.title = `La Diversité - ${data.title}`;
        
        fetch("http://localhost:3001/products")
          .then((response) => response.json())
          .then((allProducts) => {
            const filteredProducts = allProducts.filter(
              (p: Product) => p.id !== data.id && p.category === data.category
            );
            setRelatedProducts(filteredProducts.slice(0, 4));
          })
          .catch((error) =>
            console.error("Erro ao buscar produtos relacionados:", error)
          );
          
        fetch("http://localhost:3001/orders")
          .then(response => response.json())
          .then((orders: Order[]) => {
            const allReviews: Review[] = [];
            
            orders.forEach(order => {
              order.items.forEach(item => {
                if (item.id === id && item.review) {
                  allReviews.push(item.review);
                }
              });
            });
            
            setReviews(allReviews);
          })
          .catch(error => console.error("Erro ao buscar avaliações:", error));
      })
      .catch((error) => {
        console.error("Erro ao buscar produto:", error);
        setError("Falha ao carregar detalhes do produto. Tente novamente mais tarde.");
      });
  }, [id]);

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    setError(null);
    setIsAddingToCart(true);

    const cartItem = {
      id: product!.id,
      title: product!.title,
      price: parseFloat(product!.price),
      imageUrl: product!.imageUrl,
      quantity,
      category: product!.category
    };

    setTimeout(() => {
      dispatch(addToCart(cartItem));
      setIsAddingToCart(false);
      navigate("/cart");
    }, 1000);
  };

  if (!product) {
    return (
      <div className={`${isDarkMode ? "dark bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
        <Header />
        <div className="flex flex-col lg:flex-row ml-4 xl:ml-32 mt-4 space-y-4 lg:space-y-0 lg:space-x-8">
          <div className={`w-full lg:w-[534px] lg:h-[574px] ${isDarkMode ? "bg-gray-800" : "bg-amber-100"} animate-pulse rounded-lg`}></div>
          <div className="flex flex-col space-y-4 w-full lg:w-1/2">
            <div className={`h-8 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"} animate-pulse w-3/4`}></div>
            <div className={`h-4 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"} animate-pulse w-1/2`}></div>
            <div className={`h-6 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"} animate-pulse w-1/4`}></div>
            <div className={`h-12 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"} animate-pulse w-full`}></div>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className={`${isDarkMode ? "dark bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      <section className="flex items-center p-2 pl-4 xl:pl-32">
        <span className={`mr-2 text-xs md:text-sm font-semibold ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Ecommerce</span>
        <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
        <span className={`text-xs md:text-sm font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
          {product.title}
        </span>
      </section>

      <div className="flex flex-col lg:flex-row ml-4 xl:ml-32 mt-4 space-y-4 lg:space-y-0 lg:space-x-8">
        <div className={`flex justify-center items-center relative w-full lg:w-[534px] lg:h-[574px] p-2 lg:p-4 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"}`}>
          <ImageCarousel images={product.images} altText={product.altText} />
        </div>

        <div className="flex flex-col justify-start p-4 lg:p-0">
          {/* Título e botão compartilhar ajustados para evitar quebra ruim */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between w-full">
            <h2 className={`text-lg md:text-[24px] font-bold break-words max-w-full sm:max-w-[80%] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
              {product.title}
            </h2>
            <img
              src="/src/assets/share-nodes-solid.svg"
              alt="Compartilhar"
              className="w-6 h-6 cursor-pointer mt-2 sm:mt-0 sm:ml-4 shrink-0"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(10%) sepia(65%) saturate(3733%) hue-rotate(338deg) brightness(92%) contrast(94%)",
              }}
            />
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <div
              className={`flex items-center px-3 ${isDarkMode ? "bg-gray-700" : "bg-amber-100"} cursor-pointer hover:opacity-80 transition-opacity`}
              style={{
                width: "auto",
                height: "28px",
                borderRadius: "100px",
                padding: "0 12px"
              }}
              onClick={() => {
                setActiveTab("reviews");
                document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-yellow-400 text-lg mr-1">★</span>
              <span className={`text-xs whitespace-nowrap ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                {averageRating} — {reviews.length} Avaliações
              </span>
            </div>

            <div className={`w-[89px] h-[28px] border rounded-full flex items-center justify-center ${isDarkMode ? "border-amber-200" : "border-bordeaux"}`}>
              <p className={`text-xs ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>{product.status === "IN STOCK" ? "EM ESTOQUE" : "ESGOTADO"}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className={`text-base md:text-[18px] font-medium font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
              R${parseFloat(product.price).toFixed(2)}
            </p>
          </div>

          {product.status === "IN STOCK" && (
            <>
              <div className="mt-8">
                <p className={`text-xs md:text-[12px] font-semibold ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
                  QUANTIDADE
                </p>
              </div>

              <div className="mt-2">
                <div className={`w-[164px] h-[44px] border flex items-center justify-between px-4 rounded ${
                  isDarkMode ? "border-amber-200" : "border-bordeaux"
                }`}>
                  <img
                    src="/src/assets/Minus.png"
                    alt="Menos"
                    className={`w-5 h-5 cursor-pointer ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                    onClick={() => handleQuantityChange("decrease")}
                  />
                  <span className={`text-sm md:text-[14px] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>{quantity}</span>
                  <img
                    src="/src/assets/Add.png"
                    alt="Mais"
                    className={`w-5 h-5 cursor-pointer ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                    onClick={() => handleQuantityChange("increase")}
                  />
                </div>
              </div>

              <div className="mt-10">
                <button
                  className={`w-full md:w-[284px] h-[44px] bg-bordeaux text-amber-50 text-sm md:text-[14px] rounded cursor-pointer hover:bg-bordeaux-dark hover:scale-105 transition-transform duration-200 flex items-center justify-center border border-amber-200`}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-100" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
                  ) : (
                    "Adicionar ao Carrinho"
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-2">
                  <p className="text-xs md:text-[12px] text-red-400">{error}</p>
                </div>
              )}

              <div className="mt-2">
                <p className={`text-xs md:text-[12px] ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
                  — Frete grátis para compras acima de R$300,00
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row ml-4 xl:ml-32 mt-[50px]">
        <div className="flex flex-col w-full md:w-[241px]">
          <button
  onClick={() => setActiveTab("details")}
  className={`rounded-t-[8px] h-[41px] flex items-center px-3 cursor-pointer transition-transform duration-200 hover:scale-105 ${
    isDarkMode ? "bg-gray-800" : "bg-amber-100"
  } ${activeTab === "details" ? (isDarkMode ? "bg-gray-700" : "bg-amber-200") : ""}`}
>
  <img src="/src/assets/More.png" alt="Detalhes" className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`} />
  <span className={`text-sm md:text-[14px] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Detalhes</span>
</button>

<button
  onClick={() => {
    setActiveTab("reviews");
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  }}
  className={`rounded-b-[8px] h-[41px] flex items-center px-3 cursor-pointer transition-transform duration-200 hover:scale-105 ${
    isDarkMode ? "bg-gray-800" : "bg-amber-100"
  } ${activeTab === "reviews" ? (isDarkMode ? "bg-gray-700" : "bg-amber-200") : ""}`}
>
  <span className="text-yellow-400 text-lg mr-2">★</span>
  <span className={`text-sm md:text-[14px] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Avaliações</span>
</button>

        </div>

        <div className="mt-[16px] lg:mt-0 lg:ml-8 max-w-[727px] w-full" id="reviews-section">
          {activeTab === "details" ? (
            <>
              <h2 className={`text-base md:text-[16px] font-bold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Descrição</h2>
              <p className={`text-sm md:text-[14px] mt-2 ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                {product.description}
              </p>
            </>
          ) : (
            <>
              <h2 className={`text-base md:text-[16px] font-bold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Avaliações dos Clientes</h2>
              
              {reviews.length === 0 ? (
                <p className={`text-sm md:text-[14px] mt-2 ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                  Este produto ainda não possui avaliações.
                </p>
              ) : (
                <>
                  <div className="flex items-center mt-4">
                    <div className={`text-3xl font-bold mr-4 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                      {averageRating}
                    </div>
                    <div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= Math.round(parseFloat(averageRating)) 
                                ? 'text-yellow-400' 
                                : 'text-gray-400'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-amber-200" : "text-gray-600"}`}>
                        Baseado em {reviews.length} avaliações
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    {reviews
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((review, index) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-800" : "bg-amber-50"
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className={`text-sm font-semibold ${
                                isDarkMode ? "text-amber-100" : "text-bordeaux"
                              }`}>
                                {review.reviewerName}
                              </p>
                              <div className="flex items-center mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-lg ${
                                      star <= review.rating 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className={`text-xs ${
                              isDarkMode ? "text-amber-200" : "text-gray-500"
                            }`}>
                              {new Date(review.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          {review.comment && (
                            <p className={`text-sm mt-2 ${
                              isDarkMode ? "text-amber-100" : "text-gray-800"
                            }`}>
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col ml-4 xl:ml-32 mt-[200px]">
        <h2 className={`text-lg md:text-[24px] font-bold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Você também pode gostar</h2>
        <p className={`text-xs md:text-[12px] ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
          PRODUTOS SIMILARES
        </p>

        <div className="py-10 flex mt-10 justify-start flex-wrap gap-5">
          {relatedProducts.length === 0 ? (
            [1, 2, 3, 4].map((_, index) => (
              <div key={index} className={`w-[200px] h-[300px] ${isDarkMode ? "bg-gray-800" : "bg-amber-100"} animate-pulse rounded-lg`}></div>
            ))
          ) : (
            relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                altText={product.altText}
                title={product.title}
                price={parseFloat(product.price)}
                status={product.status}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Product;
