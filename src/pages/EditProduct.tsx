import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChromePicker, ColorResult } from "react-color";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../components/ThemeContext";

interface Product {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  price: number;
  status: string;
  colors: string[];
  sizes: string[];
  description: string;
  images: string[];
  category: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [product, setProduct] = useState<Product>({
    id: 0,
    imageUrl: "",
    altText: "",
    title: "",
    price: 0,
    status: "IN STOCK",
    colors: [],
    sizes: [],
    description: "",
    images: [],
    category: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");

  const categories = ["Perfume", "Trousers", "Shoe", "HandBag", "Hat", "Thermos"];
  const sizeOptions = ["S", "M", "X", "XL", "XXL"];

  
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/products/${id}`)
        .then((response) => setProduct(response.data))
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [id]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value)) {
      setErrors((prev) => ({ ...prev, title: "Title should only contain letters and spaces." }));
      return;
    }

    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  
  const handleSizeChange = (size: string) => {
    setProduct((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  
  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };

  
  const addColor = () => {
    if (!product.colors.includes(selectedColor)) {
      setProduct((prev) => ({ ...prev, colors: [...prev.colors, selectedColor] }));
    }
    setShowColorPicker(false);
  };

  
  const removeColor = (color: string) => {
    setProduct((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
  };

  
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...product.images];
    newImages[index] = value;
    setProduct((prev) => ({ ...prev, images: newImages }));
  };

  
  const addImageField = () => {
    setProduct((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  
  const removeImageField = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, images: newImages }));
  };

  
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!product.title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (product.price <= 0) {
      newErrors.price = "Price must be greater than zero.";
    }
    if (!product.imageUrl.trim()) {
      newErrors.imageUrl = "Main image URL is required.";
    }
    if (!product.status.trim()) {
      newErrors.status = "Status is required.";
    }
    if (product.colors.length === 0) {
      newErrors.colors = "At least one color is required.";
    }
    if (product.sizes.length === 0) {
      newErrors.sizes = "At least one size is required.";
    }
    if (!product.description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (product.images.length === 0 || product.images.some((img) => !img.trim())) {
      newErrors.images = "At least one product image URL is required.";
    }
    if (!product.category.trim()) {
      newErrors.category = "Category is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateFields()) {
      return;
    }
  
    if (id) {
      
      axios.put(`http://localhost:3001/products/${id}`, product)
        .then(() => {
          navigate("/listing");
          window.location.reload(); 
        })
        .catch((error) => console.error("Error updating product:", error));
    } else {
     
      const { id: _, ...productWithoutId } = product;
      axios.post("http://localhost:3001/products", productWithoutId)
        .then(() => {
          navigate("/listing");
          window.location.reload(); 
        })
        .catch((error) => console.error("Error adding product:", error));
    }
  };

  
  const handleDelete = () => {
    if (id) {
      axios.delete(`http://localhost:3001/products/${id}`)
        .then(() => navigate("/listing"))
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-700"}`}>
      <Header />

      <h1
        className={`text-left text-2xl pl-4 pt-6 pb-2 mb-0 flex items-center relative sm:pl-[174px] ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
        style={{ lineHeight: 'normal' }}
      >
        <span className={`inline-block text-2xl font-semibold ${isDarkMode ? "text-white" : "text-primary-heading"}`}>
          {id ? "Edit Product" : "Add Product"}
        </span>
      </h1>

      <section className={`flex items-center p-4 pl-4 pt-0 pb-4 sm:pl-[174px] ${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      }`}>
        <div className="flex items-center">
          <span className={`mr-2 font-bold text-sm ${isDarkMode ? "text-gray-300" : "text-custom"}`}>Ecommerce</span>
          <img src="/src/assets/arrow.png" alt=">" className="w-2 h-2 mr-2" />
          <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-primary-heading"}`}>
            {id ? "Edit Product" : "Add Product"}
          </span>
        </div>
      </section>

      <div className={`flex flex-col items-center p-4 gap-8 flex-grow ${
        isDarkMode ? "bg-black" : "bg-white"
      } pt-20`}>
        <div className="w-full max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                >
                  <option value="IN STOCK">In Stock</option>
                  <option value="NO STOCK">No Stock</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Main image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={product.imageUrl}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                />
                {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-2 p-2 rounded"
                      style={{ backgroundColor: color }}
                    >
                      <span className={`text-sm ${isDarkMode ? "text-white" : "text-white"}`}>
                        {color}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`px-6 py-2 bg-custom-button text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 text-sm cursor-pointer mt-4 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-800"
                  }`}
                >
                  {showColorPicker ? "Close Picker" : "Add Color"}
                </button>
                {showColorPicker && (
                  <div className="mt-2">
                    <ChromePicker
                      color={selectedColor}
                      onChange={handleColorChange}
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="mt-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
                    >
                      Add Selected Color
                    </button>
                  </div>
                )}
                {errors.colors && <p className="text-red-500 text-sm mt-1">{errors.colors}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Sizes</label>
                <div className="flex space-x-4">
                  {sizeOptions.map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={product.sizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className={`mr-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                      />
                      {size}
                    </label>
                  ))}
                </div>
                {errors.sizes && <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>}
              </div>
            </div>

           
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

           
            <div>
              <label className="block text-sm font-medium">Product images URL</label>
              {product.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className={`w-full p-2 border rounded ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className={`px-6 py-2 bg-custom-button text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 text-sm cursor-pointer mt-2 ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                Add Image URL
              </button>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            <div className="flex flex-col gap-2 w-48 mx-auto"> 
  <button
    type="submit"
    className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 text-sm cursor-pointer ${
      isDarkMode ? "hover:bg-green-800" : "hover:bg-green-700"
    }`}
  >
    {id ? "Update" : "Add"}
  </button>

  {id && ( 
    <button
      type="button"
      onClick={handleDelete}
      className={`w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 text-sm cursor-pointer ${
        isDarkMode ? "hover:bg-red-700" : "hover:bg-red-600"
      }`}
    >
      Delete Product
    </button>
  )}
</div>
          </form>
        </div>
      </div>

      <div className={`mt-30 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default EditProduct;