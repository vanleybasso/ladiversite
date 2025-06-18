import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";

const ForgotPassword: React.FC = () => {
  const { isLoaded, signIn } = useSignIn();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    if (!email || !validateEmail(email)) {
      setError("Por favor insira um email válido.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setSuccess("Enviamos um código para o seu email!");
      localStorage.setItem("reset_email", email);
      navigate("/reset-password");
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Erro ao enviar código.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
          Recuperar Senha
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
            Recuperar Senha
          </span>
        </div>
      </section>

      <div className={`flex justify-center items-center min-h-[calc(100vh-200px)] ${isDarkMode ? "bg-gray-900" : "bg-amber-50"} pt-8`}>
        <div className="w-full max-w-sm p-6">
          <p className={`text-sm ${isDarkMode ? "text-amber-200" : "text-gray-700"} mb-6`}>
            Digite seu email para receber um código de redefinição.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button
              type="submit"
              className={`w-full ${
                isDarkMode
                  ? "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
                  : "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
              } text-amber-50 py-2 rounded-md hover:scale-105 transition-transform duration-200 text-sm font-medium cursor-pointer flex items-center justify-center`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
              ) : (
                "Enviar código"
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

export default ForgotPassword;