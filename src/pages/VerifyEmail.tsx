import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSignUp } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";

const VerifyEmail: React.FC = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (!code.trim()) {
      setError("Código de verificação é obrigatório");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setSuccessMessage("E-mail verificado com sucesso! Sua conta foi criada.");

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (err: any) {
      const errorMessage = err.errors[0].message.includes("is incorrect")
        ? "Código inválido"
        : err.errors[0].message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        <span className={`inline-block font-semibold ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
          Verificar e-mail
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
            Verificar e-mail
          </span>
        </div>
      </section>

      <div className={`flex justify-center items-center min-h-[calc(100vh-200px)] ${isDarkMode ? "bg-gray-900" : "bg-amber-50"} pt-8`}>
        <div className="w-full max-w-sm p-6">
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>
            Verificar e-mail
          </h1>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código de verificação"
              className={`w-full px-3 py-2 border ${
                isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
              } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {successMessage && (
              <p className="text-green-400 text-sm mt-2">{successMessage}</p>
            )}
            <button
              type="submit"
              className={`w-full ${
                isDarkMode
                  ? "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
                  : "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
              } text-amber-50 py-2 rounded-md hover:scale-105 transition-transform duration-200 text-sm font-medium mt-4 cursor-pointer flex items-center justify-center`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
              ) : (
                "Verificar"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-30">
        <Footer />
      </div>
    </div>
  );
};

export default VerifyEmail;