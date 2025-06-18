import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSignIn } from "@clerk/clerk-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

const Login: React.FC = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [carregandoLogin, setCarregandoLogin] = useState(false); 
  const [carregandoGoogle, setCarregandoGoogle] = useState(false); 
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErroEmail("");
    setErroSenha("");
    setErro("");

    let valido = true;

    if (!email.trim()) {
      setErroEmail("Email é obrigatório.");
      valido = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErroEmail("Por favor, insira um email válido.");
      valido = false;
    }

    if (!senha.trim()) {
      setErroSenha("Senha é obrigatória.");
      valido = false;
    }

    if (!valido || !isLoaded) return;

    setCarregandoLogin(true); 

    try {
      const result = await signIn.create({
        identifier: email,
        password: senha,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      } else {
        console.log(result);
      }
    } catch (err: any) {
      console.error(err);
      setErro(err.errors?.[0]?.message || "Ocorreu um erro.");
    } finally {
      setCarregandoLogin(false); 
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    setCarregandoGoogle(true); 

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
      });
    } catch (err: any) {
      console.error("Erro ao autenticar com Google:", err);
      setErro("Erro ao autenticar com Google. Tente novamente.");
    } finally {
      setCarregandoGoogle(false); 
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
          Login
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
            Login
          </span>
        </div>
      </section>

      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <div className="w-full max-w-sm p-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 border ${
              isDarkMode ? "border-amber-200 bg-gray-800 text-amber-100 hover:bg-gray-700" : "border-bordeaux bg-amber-50 text-bordeaux hover:bg-amber-100"
            } rounded-md shadow-sm text-sm font-medium cursor-pointer`}
            disabled={carregandoGoogle} 
          >
            {carregandoGoogle ? (
              <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-100" : "border-bordeaux"} border-t-transparent rounded-full animate-spin`}></div>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                Continuar com Google
              </>
            )}
          </button>

          <div className="my-4 flex items-center justify-center">
            <div className={`w-full h-px ${isDarkMode ? "bg-gray-700" : "bg-amber-200"}`}></div>
            <span className={`px-2 ${isDarkMode ? "text-amber-200" : "text-bordeaux"}`}>OU</span>
            <div className={`w-full h-px ${isDarkMode ? "bg-gray-700" : "bg-amber-200"}`}></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
              />
              {erroEmail && (
                <p className="text-red-400 text-sm mt-1">{erroEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="senha" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                  } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {mostrarSenha ? (
                    <FaEyeSlash style={{ color: isDarkMode ? "#D4A59A" : "#5E0B15" }} />
                  ) : (
                    <FaEye style={{ color: isDarkMode ? "#D4A59A" : "#5E0B15" }} />
                  )}
                </button>
              </div>
              {erroSenha && (
                <p className="text-red-400 text-sm mt-1">{erroSenha}</p>
              )}
            </div>

            {erro && <p className="text-red-400 text-sm">{erro}</p>}

            <div className="flex justify-end">
              <a href="/forgot-password" className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-700"} hover:underline`}>
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full ${
                isDarkMode
                  ? "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
                  : "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
              } text-amber-50 py-2 rounded-md hover:scale-105 transition-transform duration-200 text-sm font-medium cursor-pointer flex items-center justify-center`}
              disabled={carregandoLogin} 
            >
              {carregandoLogin ? (
                <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <p className={`mt-4 text-center text-sm ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
            Não tem uma conta?{" "}
            <a href="/signup" className={`${isDarkMode ? "text-amber-100" : "text-bordeaux"} font-medium hover:underline`}>
              Cadastre-se
            </a>
          </p>
        </div>
      </div>

      <div className="mt-30">
        <Footer />
      </div>
    </div>
  );
};

export default Login;