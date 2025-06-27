import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

interface ProductCardProps {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  price: number | string;
  status: string;
  onEditClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  altText,
  title,
  price,
  status,
  onEditClick,
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const formattedPrice =
    typeof price === "number" ? price.toFixed(2) : parseFloat(price).toFixed(2);

  return (
    <div
      className={`flex flex-col items-start mx-2 w-[200px] sm:w-[248px] ${
        isDarkMode ? "text-amber-50" : "text-gray-800"
      }`}
    >
      
      <div
        className={`w-full h-[250px] sm:h-[312px] ${
          isDarkMode ? "bg-gray-800" : "bg-amber-100"
        } flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
        onClick={handleClick}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

     
      <div className="flex items-center justify-between w-full mt-4">
        <p
          className={`text-left text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px] ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          } font-semibold cursor-pointer hover:underline`}
          onClick={handleClick}
        >
          {title}
        </p>
        {onEditClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            className={`flex items-center text-sm ${
              isDarkMode
                ? "text-amber-200 hover:text-amber-100"
                : "text-bordeaux hover:text-bordeaux-dark"
            } transition-all duration-200 cursor-pointer`}
            title="Edit product"
          >
            <img
  src="/src/assets/pencil.png"
  alt="Editar"
  className="w-4 h-4 mr-1 hover:scale-105 transition-transform duration-200"
  style={{
    filter: isDarkMode
      ? "brightness(0) invert(1)"
      : "brightness(0) saturate(100%) invert(10%) sepia(65%) saturate(3733%) hue-rotate(338deg) brightness(92%) contrast(94%)",
  }}
/>

            <span className="hover:scale-105 transition-transform duration-200">
              Editar
            </span>
          </button>
        )}
      </div>

      
      <div className="flex items-center mt-2 w-full justify-between gap-2">
        <p
          className={`text-xs px-3 py-1 border rounded-full font-semibold ${
            isDarkMode
              ? "border-amber-200 text-amber-100"
              : "border-bordeaux text-bordeaux"
          }`}
        >
          {status === "IN STOCK" ? "EM ESTOQUE" : "ESGOTADO"}
        </p>

        <p
          className={`text-sm sm:text-base font-semibold ${
            isDarkMode ? "text-amber-100" : "text-bordeaux"
          }`}
        >
          R${formattedPrice}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
