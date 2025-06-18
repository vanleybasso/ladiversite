import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

const ResetPassword: React.FC = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const email = localStorage.getItem("reset_email") || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    const validationErrors: { [key: string]: string } = {};

    if (!code.trim()) {
      validationErrors.code = "Código de verificação é obrigatório.";
    }

    if (!newPassword.trim()) {
      validationErrors.newPassword = "Nova senha é obrigatória.";
    } else if (!validatePassword(newPassword)) {
      validationErrors.newPassword =
        "A senha deve ter pelo menos 8 caracteres, conter pelo menos uma letra maiúscula, um número e um caractere especial.";
    }

    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword = "Confirmação de senha é obrigatória.";
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "As senhas não coincidem.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      console.error(err);

      const rawMessage = err.errors?.[0]?.message || "";

      let customMessage = "Erro ao redefinir senha.";

      if (rawMessage.toLowerCase().includes("code") || rawMessage.toLowerCase().includes("incorrect")) {
        customMessage = "Código inválido, por favor tente novamente...";
      }

      setErrors({ form: customMessage });
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
          Redefinir Senha
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
            Redefinir Senha
          </span>
        </div>
      </section>

      <div className={`flex justify-center items-center min-h-[calc(100vh-200px)] ${isDarkMode ? "bg-gray-900" : "bg-amber-50"} pt-8`}>
        <div className="w-full max-w-sm p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Código de verificação
              </label>
              <input
                type="text"
                id="code"
                placeholder="Digite o código de 6 dígitos"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
              />
              {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
            </div>

            <div>
              <label htmlFor="new-password" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Nova senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                  } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showNewPassword ? (
                    <FaEyeSlash style={{ color: isDarkMode ? "#D4A59A" : "#5E0B15" }} />
                  ) : (
                    <FaEye style={{ color: isDarkMode ? "#D4A59A" : "#5E0B15" }} />
                  )}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            <div>
              <label htmlFor="confirm-password" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Confirmar nova senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                  } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash style={{ color: isDarkMode ? "#D4A59A" : "#5E0B15" }} />
                  ) : (
                    <FaEye style={{ color: isDarkMode ? "#D4A59A" : "#5E0B15" }} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.form && <p className="text-red-400 text-sm">{errors.form}</p>}

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
                "Redefinir senha"
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

export default ResetPassword;