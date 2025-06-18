import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useTheme } from "../components/ThemeContext";
import { useState, useEffect } from "react";

const NotFound = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const spirits = ['WHISKY', 'GIN', 'RUM', 'VODKA', 'TEQUILA', 'BRANDY'];
  const [currentSpirit, setCurrentSpirit] = useState(spirits[0]);

  const handleNavigate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpirit(prev => {
        const currentIndex = spirits.indexOf(prev);
        return spirits[(currentIndex + 1) % spirits.length];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      <section className={`min-h-screen flex flex-col justify-center items-center ${isDarkMode ? "bg-gray-900" : "bg-amber-50"} px-8 text-center relative overflow-hidden`}>
        
        <div className="absolute left-0 top-1/4 opacity-10 text-8xl">🥃</div>
        <div className="absolute right-0 bottom-1/4 opacity-10 text-8xl">🍾</div>
        
        
        <div className="mb-12">
          <h1 className={`text-5xl md:text-7xl font-bold ${isDarkMode ? "text-amber-300" : "text-bordeaux"} mb-2 tracking-wider`}>
            404
          </h1>
          <div className="h-1 w-24 mx-auto mb-6 bg-amber-600"></div>
          <p className={`text-xl md:text-2xl ${isDarkMode ? "text-amber-200" : "text-gray-800"} font-medium mb-2`}>
            LOTE PERDIDO
          </p>
          <div className="text-lg md:text-xl font-mono font-bold text-amber-600 animate-pulse">
            {currentSpirit}
          </div>
        </div>

       
        <div className={`max-w-lg mb-12 ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
          <p className="text-lg mb-4">
            Parece que este destilado ainda está envelhecendo em nossos barris.
          </p>
          <p className="text-sm italic">
            "Um bom whisky precisa de tempo, assim como esta página precisa ser encontrada."
          </p>
        </div>

        
        <Link
          to="/listing"
          className={`${isDarkMode ? "bg-amber-800 hover:bg-amber-900" : "bg-bordeaux hover:bg-bordeaux-dark"} text-white py-4 px-10 rounded-sm transition-all duration-300 text-lg flex items-center gap-3 group relative overflow-hidden`}
          onClick={handleNavigate}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Envelhecendo...</span>
            </div>
          ) : (
            <>
              <span className="relative z-10">EXPLORAR CATÁLOGO</span>
              <span className="text-xl transition-transform duration-300 group-hover:rotate-12">🧊</span>
              <div className={`absolute inset-0 ${isDarkMode ? "bg-amber-900" : "bg-bordeaux-dark"} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            </>
          )}
        </Link>
      </section>
    </>
  );
};

export default NotFound;