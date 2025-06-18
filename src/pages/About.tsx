import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaWineBottle, FaWineGlassAlt } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext"; 

const About = () => {
  const { isDarkMode } = useTheme(); 

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-amber-50 text-gray-800"}`}>
      <Header />

      
      <section className={`${isDarkMode ? "bg-gray-900" : "bg-gradient-to-r from-amber-50 to-amber-100"} py-20 px-10 lg:px-[182px] flex flex-col lg:flex-row items-center justify-between`}>
        <div className="w-full max-w-xl mx-auto lg:mx-0 text-center mb-10 lg:mb-0 lg:text-left">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? "text-amber-50" : "text-bordeaux"}`}>
            La Diversité
          </h1>
          <p className={`text-sm mb-6 ${isDarkMode ? "text-amber-100" : "text-gray-700"}`}>
            Especialistas em bebidas importadas de alto padrão.
          </p>
          <div className="flex justify-center lg:justify-start">
            <FaWineGlassAlt className={`text-3xl ${isDarkMode ? "text-amber-200" : "text-bordeaux"} animate-pulse`} />
          </div>
        </div>

        <div className="w-full lg:w-1/2 hidden lg:flex justify-center">
          <img
            src="/src/assets/adega1.jpg"
            alt="Interior da Loja La Diversité"
            className="w-full max-w-[500px] h-auto rounded-lg shadow-xl"
          />
        </div>
      </section>

      
      <section className={`py-16 px-10 lg:px-[182px] ${isDarkMode ? "bg-gray-800" : "bg-amber-50"}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <span className={`text-sm font-medium ${
              isDarkMode
                ? "text-xs w-[89px] h-[28px] border border-amber-200 text-amber-200 rounded-full flex items-center justify-center font-semibold"
                : "text-bordeaux border border-bordeaux rounded-[100px] py-1 px-4"
            }`}>
              Nossa História
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className={`mb-4 ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
                Fundada em 2010, a La Diversité nasceu da paixão por bebidas finas e da vontade de trazer ao mercado brasileiro os melhores rótulos internacionais.
              </p>
              <p className={`mb-4 ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
                Começamos como uma pequena importadora e hoje somos referência no segmento de bebidas premium, atendendo clientes exigentes em todo o país.
              </p>
              <p className={`${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
                Nosso nome reflete nossa essência: a diversidade de sabores, origens e experiências que oferecemos.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="/src/assets/adega2.jpg" 
                alt="Adega climatizada La Diversité"
                className="rounded-lg shadow-xl max-h-80 object-cover border-2 border-amber-200"
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className={`py-16 px-10 lg:px-[182px] ${isDarkMode ? "bg-gray-900" : "bg-amber-50"}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <span className={`text-sm font-medium ${
              isDarkMode
                ? "text-xs w-[89px] h-[28px] border border-amber-200 text-amber-200 rounded-full flex items-center justify-center font-semibold"
                : "text-bordeaux border border-bordeaux rounded-[100px] py-1 px-4"
            }`}>
              Nossos Valores
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`${isDarkMode ? "bg-gray-700 text-amber-200" : "bg-amber-100 text-bordeaux"} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Excelência</h3>
              <p className={`text-sm ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>Selecionamos apenas os melhores produtos com rigorosos critérios de qualidade.</p>
            </div>
            
            <div className="text-center">
              <div className={`${isDarkMode ? "bg-gray-700 text-amber-200" : "bg-amber-100 text-bordeaux"} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Autenticidade</h3>
              <p className={`text-sm ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>Garantimos a procedência e originalidade de todos os nossos produtos.</p>
            </div>
            
            <div className="text-center">
              <div className={`${isDarkMode ? "bg-gray-700 text-amber-200" : "bg-amber-100 text-bordeaux"} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Experiência</h3>
              <p className={`text-sm ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>Oferecemos consultoria especializada para cada momento e ocasião.</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className={`py-16 px-10 lg:px-[182px] ${isDarkMode ? "bg-gray-800" : "bg-gradient-to-r from-amber-100 to-amber-50"} mt-20`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <span className={`text-sm font-medium ${
              isDarkMode
                ? "text-xs w-[89px] h-[28px] border border-amber-200 text-amber-200 rounded-full flex items-center justify-center font-semibold"
                : "text-bordeaux border border-bordeaux rounded-[100px] py-1 px-4"
            }`}>
              Contato
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Nossos Canais</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaWhatsapp className={`${isDarkMode ? "text-amber-200" : "text-bordeaux"} mr-4 text-xl`} />
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-amber-100" : "text-gray-800"}`}>WhatsApp</p>
                    <a href="https://wa.me/5511999999999" className={`${isDarkMode ? "text-amber-50 hover:text-amber-200" : "text-gray-700 hover:text-bordeaux"}`}>
                      (54) 99621-4447
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaInstagram className={`${isDarkMode ? "text-amber-200" : "text-bordeaux"} mr-4 text-xl`} />
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-amber-100" : "text-gray-800"}`}>Instagram</p>
                    <a href="https://instagram.com/ladiversite" className={`${isDarkMode ? "text-amber-50 hover:text-amber-200" : "text-gray-700 hover:text-bordeaux"}`}>
                      @ladiversite
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaMapMarkerAlt className={`${isDarkMode ? "text-amber-200" : "text-bordeaux"} mr-4 text-xl`} />
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-amber-100" : "text-gray-800"}`}>Endereço</p>
                    <p className={`${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
                      Av. Severiano de Almeida, 1110 - Getúlio Vargas/RS
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-amber-100" : "text-bordeaux"}`}>Horário de Funcionamento</h3>
              <ul className={`space-y-2 ${isDarkMode ? "text-amber-50" : "text-gray-700"}`}>
                <li className="flex justify-between border-b border-amber-200 pb-2">
                  <span>Segunda a Sexta</span>
                  <span>10h - 20h</span>
                </li>
                <li className="flex justify-between border-b border-amber-200 pb-2">
                  <span>Sábado</span>
                  <span>10h - 18h</span>
                </li>
                <li className="flex justify-between border-b border-amber-200 pb-2">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </li>
              </ul>
              
              <div className={`mt-6 ${isDarkMode ? "bg-gray-700 bg-opacity-50 text-amber-100" : "bg-amber-200 bg-opacity-30 text-bordeaux"} p-4 rounded-lg`}>
                <p className="text-sm">Visitas à nossa adega climatizada somente com agendamento prévio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;