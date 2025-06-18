import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
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

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [product, setProduct] = useState<Product>({
    id: "",
    imageUrl: "",
    altText: "",
    title: "",
    price: "",
    status: "IN STOCK",
    rating: 0,
    reviewsCount: 0,
    description: "",
    images: [],
    category: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = ["Cerveja", "Vinho", "Whiskey", "Vodka", "Gin", "Licor", "Espumante"];

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/products/${id}`)
        .then((response) => setProduct(response.data))
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [id]);

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...product.images];
    newImages[index] = value;
    setProduct((prev) => ({ ...prev, images: newImages }));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const addImageField = () => {
    setProduct((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, images: newImages }));
  };

  const validateFields = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!product.title.trim()) {
      newErrors.title = "Título é obrigatório.";
    }
    if (!product.price || isNaN(parseFloat(product.price))) {
      newErrors.price = "Preço deve ser um número válido.";
    } else if (parseFloat(product.price) <= 0) {
      newErrors.price = "Preço deve ser maior que zero.";
    }
    if (!product.imageUrl.trim()) {
      newErrors.imageUrl = "URL da imagem principal é obrigatória.";
    }
    if (!product.status.trim()) {
      newErrors.status = "Status é obrigatório.";
    }
    if (!product.description.trim()) {
      newErrors.description = "Descrição é obrigatória.";
    }
    if (product.images.length === 0) {
      newErrors.images = "Pelo menos uma imagem do produto é obrigatória.";
    } else if (product.images.some((img) => !img.trim())) {
      newErrors.images = "Todas as URLs de imagem devem ser preenchidas.";
    }
    if (!product.category.trim()) {
      newErrors.category = "Categoria é obrigatória.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateFields()) {
      return;
    }
  
    const productToSubmit = id ? product : { ...product, id: generateId() };
    const request = id
      ? axios.put(`http://localhost:3001/products/${id}`, productToSubmit)
      : axios.post("http://localhost:3001/products", productToSubmit);
  
    request
      .then(() => {
        navigate("/listing");
      })
      .catch((error) => {
        console.error("Error saving product:", error);
        setErrors((prev) => ({
          ...prev,
          submit: "Erro ao salvar o produto. Tente novamente.",
        }));
      });
  };

  const handleDelete = () => {
    if (id && window.confirm("Tem certeza que deseja excluir este produto?")) {
      axios.delete(`http://localhost:3001/products/${id}`)
        .then(() => navigate("/listing"))
        .catch((error) => {
          console.error("Error deleting product:", error);
          setErrors((prev) => ({
            ...prev,
            submit: "Erro ao excluir o produto. Tente novamente.",
          }));
        });
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark bg-gray-900 text-amber-50" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      {/* Breadcrumb */}
      <section className={`flex items-center p-4 pl-24 ${isDarkMode ? "bg-gray-800" : "bg-amber-100"}`}>
        <span className={`mr-2 font-bold text-sm ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Ecommerce</span>
        <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
        <span className={`text-sm font-semibold ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
          {id ? "Editar Produto" : "Adicionar Produto"}
        </span>
      </section>

      <div className="flex flex-col items-center p-4 gap-8 flex-grow pt-8">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>
          {id ? "Editar Produto" : "Adicionar Produto"}
        </h1>

        <div className="w-full max-w-4xl mx-auto">
          {errors.submit && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Título*</label>
                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Categoria*</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.category ? "border-red-500" : ""}`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Price and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Preço*</label>
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Status*</label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.status ? "border-red-500" : ""}`}
                >
                  <option value="IN STOCK">Em Estoque</option>
                  <option value="NO STOCK">Sem Estoque</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
            </div>

            {/* Main Image and Alt Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>URL da Imagem Principal*</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={product.imageUrl}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.imageUrl ? "border-red-500" : ""}`}
                />
                {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Texto Alternativo</label>
                <input
                  type="text"
                  name="altText"
                  value={product.altText}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"}`}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Descrição*</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.description ? "border-red-500" : ""}`}
                rows={5}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Additional Images */}
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>URLs das Imagens Adicionais*</label>
              {product.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-amber-50" : "bg-white border-amber-200 text-gray-800"} ${errors.images ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? "bg-gray-700 text-amber-100" : "bg-amber-100 text-bordeaux"} hover:bg-red-500 hover:text-white`}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className={`px-4 py-2 bg-bordeaux text-amber-50 rounded-lg hover:bg-bordeaux-dark hover:scale-105 transition-all duration-300 text-sm cursor-pointer mt-2 border border-amber-200`}
              >
                Adicionar URL de Imagem
              </button>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                type="submit"
                className={`px-6 py-2 bg-bordeaux text-amber-50 rounded-lg hover:bg-bordeaux-dark hover:scale-105 transition-all duration-300 text-sm cursor-pointer border border-amber-200`}
              >
                {id ? "Atualizar Produto" : "Adicionar Produto"}
              </button>

              {id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`px-6 py-2 bg-red-500 text-amber-50 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 text-sm cursor-pointer border border-amber-200`}
                >
                  Excluir Produto
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default EditProduct;