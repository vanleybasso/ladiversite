import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import ImageCarousel from "../components/ImageCarousel";
import { useTheme } from "../components/ThemeContext";

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
          <div className="flex items-center justify-between w-full">
            <h2 className={`text-lg md:text-[24px] font-bold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>{product.title}</h2>
            <img
              src="/src/assets/Share.png"
              alt="Compartilhar"
              className={`w-6 h-6 cursor-pointer ml-30 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
            />
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <div
              className={`flex items-center px-3 ${isDarkMode ? "bg-gray-700" : "bg-amber-100"}`}
              style={{
                width: "auto",
                height: "28px",
                borderRadius: "100px",
                padding: "0 12px"
              }}
            >
              <img src="/src/assets/star.png" alt="Star" className="w-4 h-[15px] mr-1" />
              <span className={`text-xs whitespace-nowrap ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
                {product.rating.toFixed(1)} — {product.reviewsCount} Avaliações
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
        <div className={`rounded-[8px] w-full md:w-[241px] h-[41px] flex items-center px-3 ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        }`}>
          <img src="/src/assets/More.png" alt="Ícone" className={`w-6 h-6 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`} />
          <span className={`text-sm md:text-[14px] ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Detalhes</span>
        </div>

        <div className="mt-[16px] lg:mt-0 lg:ml-8 max-w-[727px]">
          <h2 className={`text-base md:text-[16px] font-bold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Descrição</h2>
          <p className={`text-sm md:text-[14px] mt-2 ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
            {product.description}
          </p>
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
