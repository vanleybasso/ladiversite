import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import productsData from "../../db.json";
import { useTheme } from "../components/ThemeContext";

interface Product {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  price: number;
  status: string;
  category: string;
}

interface ProductsData {
  products: Product[];
}

const Listing = () => {
  const [priceFilter, setPriceFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

  const isAdmin = user?.publicMetadata?.role === "admin";

  const productsPerPage = 9;

  useEffect(() => {
    const savedPriceFilter = localStorage.getItem("priceFilter");
    const savedSelectedCategory = localStorage.getItem("selectedCategory");
    const savedSearchTerm = localStorage.getItem("searchTerm");

    if (savedPriceFilter) setPriceFilter(Number(savedPriceFilter));
    if (savedSelectedCategory) setSelectedCategory(savedSelectedCategory);
    if (savedSearchTerm) setSearchTerm(savedSearchTerm);
  }, []);

  useEffect(() => {
    localStorage.setItem("priceFilter", priceFilter.toString());
  }, [priceFilter]);

  useEffect(() => {
    if (selectedCategory !== null) {
      localStorage.setItem("selectedCategory", selectedCategory);
    } else {
      localStorage.removeItem("selectedCategory");
    }
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  const calculateMaxPrice = (category: string | null) => {
    const filteredProducts = category
      ? productsData.products.filter((product) => product.category === category)
      : productsData.products;

    const prices = filteredProducts.map((product) => product.price);
    const maxProductPrice = Math.max(...prices);
    const roundedMaxPrice = Math.ceil(maxProductPrice);
    setMaxPrice(roundedMaxPrice);
    setPriceFilter(roundedMaxPrice);
  };

  useEffect(() => {
    calculateMaxPrice(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceFilter(Number(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const percentage = (priceFilter / maxPrice) * 100;

  const products = (productsData as ProductsData).products;
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = product.price <= priceFilter;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsLoading(false);
    }, 500);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
      }, 500);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleCategoryClick = (category: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedCategory === category) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(category);
      }
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  const handleEditProduct = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleAddProduct = () => {
    navigate("/edit-product");
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      {/* Breadcrumb */}
      <section className={`flex items-center p-4 pl-24 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"}`}>
        <span className={`mr-2 font-bold text-sm ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Ecommerce</span>
        <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
        <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Busca</span>
      </section>

      {/* Main Content */}
      <section className="flex flex-col lg:flex-row p-4 lg:pl-24 lg:pr-24 mt-12 flex-grow">
        {/* Filters Sidebar */}
        <section className={`rounded-lg w-full lg:w-64 mb-8 lg:mb-0 lg:mr-8 ${isDarkMode ? "bg-gray-800" : "bg-amber-50"}`}>
          <div className={`border rounded-lg p-4 ${isDarkMode ? "border-gray-700" : "border-amber-200"}`}>
            <h3 className={`font-bold mb-5 text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Categorias</h3>
            {["Cerveja", "Vinho", "Whiskey", "Vodka", "Gin", "Licor", "Espumante"].map((category) => (
              <div key={category} className="mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className={`mr-2 appearance-none w-4 h-4 border rounded-sm checked:bg-bordeaux checked:border-bordeaux relative ${
                      isDarkMode ? "border-gray-500" : "border-gray-400"
                    }`}
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryClick(category)}
                  />
                  <span className={`text-sm ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>{category}</span>
                </label>
                <hr className={`my-3 ${isDarkMode ? "border-gray-700" : "border-amber-200"}`} />
              </div>
            ))}

            <h4 className={`font-bold mb-5 mt-5 text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Preço</h4>

            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="1"
                value={priceFilter}
                onChange={handleSliderChange}
                className="w-full mb-10 appearance-none h-2 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${isDarkMode ? '#9CA3AF' : '#5E0B15'} 0%, ${isDarkMode ? '#9CA3AF' : '#5E0B15'} ${percentage}%, ${isDarkMode ? '#4B5563' : '#E6E7E8'} ${percentage}%, ${isDarkMode ? '#4B5563' : '#E6E7E8'} 100%)`,
                }}
              />

              <div
                className={`absolute top-8 transform -translate-x-1/2 w-20 h-7 flex items-center justify-center border rounded-full text-[12px] ${
                  isDarkMode ? "bg-bordeaux text-amber-50 border-gray-600" : "bg-bordeaux text-amber-50 border-gray-200"
                }`}
                style={{ left: `${percentage}%` }}
              >
                R${priceFilter.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Products */}
        <div className="w-full lg:w-64 mb-8 lg:mb-0 lg:ml-8 order-1 lg:order-2">
          <div
            className={`flex items-center border rounded-lg p-2 ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-amber-50 border-amber-200"
            } focus-within:outline focus-within:outline-2 focus-within:outline-bordeaux`}
          >
            <img
              src="/src/assets/Search.png"
              alt="Buscar"
              className={`w-5 h-5 mr-2 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
            />
            <input
              type="text"
              placeholder="Buscar produtos"
              className={`w-full outline-none text-sm ${
                isDarkMode ? "bg-gray-700 text-amber-50" : "bg-amber-50 text-gray-800"
              }`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <section className="flex-1 order-2 lg:order-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>Filtros aplicados:</h3>
            
            {isAdmin && (
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-bordeaux text-amber-50 rounded-lg hover:bg-bordeaux-dark hover:scale-105 transition-all duration-300 text-sm cursor-pointer border border-amber-200"
              >
                Adicionar Produto
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {selectedCategory && (
              <div className={`flex items-center border rounded-full px-3 py-2 ${
                isDarkMode ? "border-gray-600 bg-gray-700" : "border-amber-200 bg-amber-100"
              }`}>
                <span className={`text-[12px] font-semibold ${
                  isDarkMode ? "text-amber-100" : "text-bordeaux"
                }`}>{selectedCategory}</span>
                <img
                  src="/src/assets/close.png"
                  alt="Remover filtro"
                  className={`w-4 h-4 ml-2 cursor-pointer ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                  onClick={() => setSelectedCategory(null)}
                />
              </div>
            )}
            {priceFilter < maxPrice && (
              <div className={`flex items-center border rounded-full px-3 py-2 ${
                isDarkMode ? "border-gray-600 bg-gray-700" : "border-amber-200 bg-amber-100"
              }`}>
                <span className={`text-[12px] font-semibold ${
                  isDarkMode ? "text-amber-100" : "text-bordeaux"
                }`}>R${priceFilter.toFixed(2)}</span> 
                <img
                  src="/src/assets/close.png"
                  alt="Remover filtro"
                  className={`w-4 h-4 ml-2 cursor-pointer ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                  onClick={() => setPriceFilter(maxPrice)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-7">
            <div className={`text-xs ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
              {filteredProducts.length === 0
                ? "Mostrando 0 de 0 resultados"
                : `Mostrando ${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, filteredProducts.length)} de ${filteredProducts.length} resultados`}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center mt-8">
              <div 
                className={`w-8 h-8 border-2 rounded-full animate-spin ${
                  isDarkMode ? "border-amber-200 border-t-transparent" : "border-bordeaux border-t-transparent"
                }`}
              ></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-70 mt-8 justify-center">
              {currentProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard
                    id={product.id}
                    imageUrl={product.imageUrl}
                    altText={product.altText}
                    title={product.title}
                    price={product.price}
                    status={product.status}
                    onEditClick={isAdmin ? () => handleEditProduct(product.id) : undefined} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center mt-12">
            <div
              className={`flex items-center justify-between px-4 py-2 rounded ${
                isDarkMode ? "border-gray-600" : "border-amber-200"
              }`}
              style={{
                width: "152px",
                height: "44px",
                border: "1px solid",
              }}
            >
              <button
                className={`hover:opacity-80 transition ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={prevPage}
                disabled={currentPage === 1 || isLoading}
              >
                <img
                  src="/src/assets/left.png"
                  alt="Página anterior"
                  className={`w-6 h-6 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                />
              </button>

              <div
                className={`flex items-center justify-center text-sm font-medium ${
                  isDarkMode ? "text-amber-100 bg-gray-700" : "text-bordeaux bg-amber-100"
                }`}
                style={{
                  width: "40px",
                  height: "32px",
                  borderRadius: "4px",
                }}
              >
                {currentPage}
              </div>

              <button
                className={`hover:opacity-80 transition ${
                  currentPage === Math.ceil(filteredProducts.length / productsPerPage)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={nextPage}
                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage) || isLoading}
              >
                <img
                  src="/src/assets/rigth.png"
                  alt="Próxima página"
                  className={`w-6 h-6 ${isDarkMode ? "filter brightness-0 invert" : ""}`}
                />
              </button>
            </div>
          </div>
        </section>
      </section>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default Listing;