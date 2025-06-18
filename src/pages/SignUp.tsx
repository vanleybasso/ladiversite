import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSignUp } from "@clerk/clerk-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

const SignUp: React.FC = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);
  const { isDarkMode } = useTheme();

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return regex.test(senha);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErroNome("");
    setErroEmail("");
    setErroSenha("");
    setErro("");

    let valido = true;

    if (!nome.trim()) {
      setErroNome("Nome é obrigatório.");
      valido = false;
    }

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
    } else if (!validarSenha(senha)) {
      setErroSenha(
        "A senha deve ter pelo menos 8 caracteres, conter pelo menos uma letra maiúscula, um número e um caractere especial."
      );
      valido = false;
    }

    if (!valido || !isLoaded) return;

    setCarregandoCadastro(true);

    try {
      await signUp.create({
        firstName: nome,
        emailAddress: email,
        password: senha,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      window.location.href = "/verify-email";
    } catch (err: any) {
      console.error(err);
      setErro(err.errors?.[0]?.message || "Ocorreu um erro.");
    } finally {
      setCarregandoCadastro(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    setCarregandoGoogle(true);

    try {
      await signUp.authenticateWithRedirect({
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
          Cadastre-se
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
            Cadastre-se
          </span>
        </div>
      </section>

      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <div className="w-full max-w-sm p-6">
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
              <label htmlFor="nome" className={`block text-sm font-medium ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode ? "border-amber-200 bg-gray-800 text-amber-50" : "border-bordeaux bg-amber-50"
                } rounded-md shadow-sm focus:outline-none focus:ring-bordeaux focus:border-bordeaux text-sm`}
              />
              {erroNome && (
                <p className="text-red-400 text-sm mt-1">{erroNome}</p>
              )}
            </div>

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
              <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-gray-700"} mt-2`}>
                Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade.
              </p>
            </div>

            {erro && <p className="text-red-400 text-sm mt-1">{erro}</p>}

            <button
              type="submit"
              className={`w-full ${
                isDarkMode
                  ? "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
                  : "bg-bordeaux hover:bg-bordeaux-dark border border-amber-200"
              } text-amber-50 py-2 rounded-md hover:scale-105 transition-transform duration-200 text-sm font-medium cursor-pointer flex items-center justify-center`}
              disabled={carregandoCadastro}
            >
              {carregandoCadastro ? (
                <div className={`w-5 h-5 border-2 ${isDarkMode ? "border-amber-50" : "border-amber-50"} border-t-transparent rounded-full animate-spin`}></div>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          <p className={`mt-4 text-center text-sm ${isDarkMode ? "text-amber-200" : "text-gray-700"}`}>
            Já tem uma conta?{" "}
            <a href="/login" className={`${isDarkMode ? "text-amber-100" : "text-bordeaux"} font-medium hover:underline`}>
              Entrar
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

export default SignUp;