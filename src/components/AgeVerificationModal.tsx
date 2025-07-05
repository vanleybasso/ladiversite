import React from "react";

interface AgeVerificationModalProps {
  onVerify: (isVerified: boolean) => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerify }) => {
  const handleYesClick = () => {
    localStorage.setItem('ageVerified', 'true');
    onVerify(true);
  };

  const handleNoClick = () => {
    window.location.href = "https://www.youtube.com/watch?v=kX4wbaMVt-4";
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer"
      onClick={(e) => e.target === e.currentTarget && handleNoClick()}
    >
      <div className="bg-amber-50 p-8 rounded-lg max-w-sm w-full mx-4 text-center">
        
        <div className="mb-6 flex justify-center">
          <img 
            src="/src/assets/beer.png" 
            alt="Logo da Empresa" 
            className="h-16 w-auto cursor-default" 
          />
        </div>
        
        <h2 className="text-2xl font-bold text-bordeaux mb-6 cursor-default">
          Você tem mais de 18 anos?
        </h2>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleYesClick}
            className="bg-bordeaux text-amber-50 px-8 py-2 rounded-md hover:bg-bordeaux-dark 
                     transition-all duration-300 transform hover:scale-105 active:scale-95 
                     cursor-pointer shadow-md hover:shadow-lg"
          >
            Sim
          </button>
          <button
            onClick={handleNoClick}
            className="bg-gray-300 text-gray-800 px-8 py-2 rounded-md hover:bg-gray-400 
                     transition-all duration-300 transform hover:scale-105 active:scale-95 
                     cursor-pointer shadow-md hover:shadow-lg"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;