import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useTheme } from "../components/ThemeContext";
import AgeVerificationModal from "../components/AgeVerificationModal";

interface Product {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  price: string;
  status: string;
  rating?: number;
}

interface OrderItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category: string;
}

interface Order {
  items: OrderItem[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [mostSoldProducts, setMostSoldProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    
    const isVerified = localStorage.getItem('ageVerified') === 'true';
    if (!isVerified) {
      setShowAgeModal(true);
    }
    
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
   
    Promise.all([
      fetch("http://localhost:3001/products").then(res => res.json()),
      fetch("http://localhost:3001/orders").then(res => res.json())
    ])
    .then(([productsData, ordersData]) => {
      setProducts(productsData);
      
      
      const productSales: Record<string, number> = {};
      
      ordersData.forEach((order: Order) => {
        order.items.forEach(item => {
          if (productSales[item.id]) {
            productSales[item.id] += item.quantity;
          } else {
            productSales[item.id] = item.quantity;
          }
        });
      });
      
     
      const topSoldIds = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([id]) => id);
      
      
      const topSoldProducts = productsData.filter((product: Product) => 
        topSoldIds.includes(product.id.toString())
      );
      
      setMostSoldProducts(topSoldProducts);
      
      
      const shuffled = [...productsData].sort(() => 0.5 - Math.random());
      setPromoProducts(shuffled.slice(0, 4));
    })
    .catch(error => console.error("Erro ao buscar dados:", error));
  }, []);

  const handleViewCollectionClick = () => {
    navigate("/listing");
  };

  const handleStartBrowsingClick = () => {
    navigate("/listing");
  };

  const refreshPromotions = () => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setPromoProducts(shuffled.slice(0, 4));
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-amber-50 text-gray-800"}`}>
      {showAgeModal && (
        <AgeVerificationModal 
          onVerify={(verified) => setShowAgeModal(!verified)} 
        />
      )}
      
      <Header />
      
     
      <section className={`${isDarkMode ? "bg-gray-900" : "bg-gradient-to-r from-amber-50 to-amber-100"} pt-20 pb-10 px-10 flex flex-col lg:flex-row items-center justify-between`}>
        <div className="w-full max-w-xl mx-auto lg:ml-[182px] text-center mb-10 lg:mb-0 lg:text-left">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? "text-amber-50" : "text-bordeaux"}`}>
            Sabores do mundo, brindes únicos.
          </h1>
          <p className={`text-sm mb-6 mt--2 ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
            Descubra nossos rótulos exclusivos.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button
              className="text-sm bg-bordeaux text-amber-50 py-2 px-6 rounded-md hover:bg-bordeaux-dark hover:scale-105 transition-all duration-300 border border-amber-200 cursor-pointer flex items-center gap-2"
              onClick={handleViewCollectionClick}
            >
              Ver Catálogo
              <img
                src="/src/assets/Arrow-Right.png"
                alt="Ícone de bebidas"
                className="w-6 h-6 filter brightness-0 invert"
              />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 hidden lg:flex justify-center">
          <img
            src="/src/assets/bebidas.png"
            alt="Coleção de bebidas premium"
            className="w-full max-w-[500px] h-auto rounded-lg"
          />
        </div>
      </section>

      
      <section className="px-10 lg:ml-[182px] mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="flex flex-col items-start">
          <img
            src="/src/assets/truck.png"
            alt="Ícone de Frete Grátis"
            className="w-6 h-6 mb-4 filter brightness-0"
            style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
          />
          <h2 className={`text-base font-bold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Frete Grátis
          </h2>
          <p className={`text-sm max-w-md ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
            Compre seus importados favoritos com<br />
            FRETE GRÁTIS para pedidos acima de R$300,00.
          </p>
        </div>

        <div className="flex flex-col items-start">
          <img
            src="/src/assets/satisfation.png"
            alt="Ícone de Garantia"
            className="w-6 h-6 mb-4 filter brightness-0"
            style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
          />
          <h2 className={`text-base font-bold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Garantia de Qualidade
          </h2>
          <p className={`text-sm max-w-md ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
            Produtos importados diretamente com<br />
            certificação de origem e qualidade garantida.
          </p>
        </div>

        <div className="flex flex-col items-start">
          <img
            src="/src/assets/security.png"
            alt="Ícone de Pagamento Seguro"
            className="w-6 h-6 mb-4 filter brightness-0"
            style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(49%) saturate(2081%) hue-rotate(337deg) brightness(89%) contrast(94%)' }}
          />
          <h2 className={`text-base font-bold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Pagamento Seguro
          </h2>
          <p className={`text-sm max-w-md ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
            Processamos seus pagamentos com total
            <br />
            segurança e sigilo.
          </p>
        </div>
      </section>

      
      <section className="py-20 px-10 text-center mt-16">
        <h2 className={`text-[12px] mb-2 ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
          COMPRE AGORA
        </h2>
        <h3 className={`text-[24px] font-bold ${isDarkMode ? "text-amber-50" : "text-bordeaux"}`}>
          Destaques do Mês
        </h3>
        <p className={`text-sm mt-2 ${isDarkMode ? "text-amber-100" : "text-gray-600"}`}>
          Os produtos mais comprados pelos nossos clientes
        </p>
      </section>

      <section className="py-10 px-10 flex mt-4 justify-center flex-wrap gap-5">
        {mostSoldProducts.length > 0 ? (
          mostSoldProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.imageUrl}
              altText={product.altText}
              title={product.title}
              price={product.price}
              status={product.status}
              isBestSeller={true}
            />
          ))
        ) : (
          
          products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.imageUrl}
              altText={product.altText}
              title={product.title}
              price={product.price}
              status={product.status}
            />
          ))
        )}
      </section>

      
      <section className={`${isDarkMode ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-amber-100 to-amber-50"} py-20 px-10 lg:pl-[174px] lg:pr-[213px] flex items-center justify-between mt-28`}>
        <div className="text-left">
          <h2 className={`text-[24px] font-bold mb-4 ${isDarkMode ? "text-amber-50" : "text-bordeaux"}`}>
            Explore nossa seleção premium!
          </h2>
          <p className={`text-[14px] mb-6 leading-relaxed ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
            Descubra os melhores vinhos, whiskies e bebidas especiais
            <br />
            importados dos melhores produtores mundiais.
          </p>
          <button
            className="text-amber-50 py-2 px-6 rounded-md hover:bg-bordeaux-dark hover:scale-105 transition-all duration-300 flex items-center bg-bordeaux text-sm cursor-pointer gap-2 border border-amber-200"
            onClick={handleStartBrowsingClick}
          >
            Explorar Seleção
            <img
              src="/src/assets/Arrow-Right.png"
              alt="Ícone de navegação"
              className="w-6 h-6 filter brightness-0 invert"
            />
          </button>
        </div>

        <div className="w-[125px] h-[225px] hidden lg:block">
          <img
            src="/src/assets/copo.png"
            alt="Seleção de Bebidas"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      
      <section className="py-10 px-10 flex flex-col mt-20 items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center">
            <span className={`text-sm font-medium ${
              isDarkMode
                ? "text-xs w-[89px] h-[28px] border border-amber-200 text-amber-200 rounded-full flex items-center justify-center font-semibold"
                : "text-bordeaux border border-bordeaux rounded-[100px] py-1 px-4"
            }`}>
              Promoções
            </span>
          </div>
          <button 
            onClick={refreshPromotions}
            className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-bordeaux'} hover:underline flex items-center gap-1 cursor-pointer`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Mostrar outras ofertas
          </button>
        </div>

        <div className="flex justify-center flex-wrap gap-5">
          {promoProducts.length > 0 ? (
            promoProducts.map((product) => (
              <ProductCard
                key={`${product.id}-${Math.random()}`}
                id={product.id}
                imageUrl={product.imageUrl}
                altText={product.altText}
                title={product.title}
                price={product.price}
                status={product.status}
                isPromo={true}
              />
            ))
          ) : (
            
            products.slice(4, 8).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                altText={product.altText}
                title={product.title}
                price={product.price}
                status={product.status}
              />
            ))
          )}
        </div>
      </section>

      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Home;