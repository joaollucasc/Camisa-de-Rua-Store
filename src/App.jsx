import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ModalAuth from "./components/ModalAuth";
import Home from "./pages/Home";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    navigate("/home");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada!");
  };

  const handleExploreClick = () => {
    if (user) {
      navigate("/home");
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans">
      <Routes>
        {/* Rota da Landing Page (pública) */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white font-sans w-full overflow-x-hidden">
              {/* HEADER */}
              <header className="bg-verde-rua text-white py-4 px-4 w-full">
                <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <img
                      src="/images/vector.png"
                      alt="Camisa de Rua Logo"
                      className="h-12 w-auto max-w-full object-contain"
                    />
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={handleExploreClick}
                      className="bg-verde-neon hover:bg-verde-rua text-white font-bold py-2 px-6 rounded-full text-xl transition-all duration-500 transform hover:scale-95 whitespace-nowrap" // Corrigido
                    >
                      EXPLORAR COLEÇÃO!
                    </button>
                  </div>
                </div>
              </header>

              {/* HERO SECTION */}
              <section className="relative bg-verde-claro text-white py-10 px-4 w-full">
                {" "}
                <div className="flex justify-center items-center w-full max-w-full">
                  {/* mobile */}
                  <img
                    src="/images/capaaa.png"
                    alt="Camisa de Rua"
                    className="mx-auto w-full max-w-md md:hidden object-contain"
                  />

                  {/* desktop */}
                  <img
                    src="/images/capa.png"
                    alt="Camisa de Rua"
                    className="mx-auto w-full max-w-6xl hidden md:block object-contain"
                  />
                </div>
              </section>

              {/* OBJETIVO SECTION */}
              <section className="py-20 px-4 bg-verde-claro w-full">
                <div className="max-w-5xl mx-auto w-full">
                  <h2 className="text-4xl font-black text-center mb-12 text-white">
                    NOSSO <span className="text-verde-neon">OBJETIVO</span>
                  </h2>

                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 w-full">
                    {" "}
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                      A Camisa de Rua Store nasceu com o propósito de vestir a
                      cultura da periferia e dar visibilidade às histórias que
                      nascem no asfalto, nos becos e nas vielas onde a
                      criatividade floresce. Cada estampa é um retrato vivo da
                      energia dos blocos independentes e do carnaval de rua,
                      onde a música, a dança e a coletividade se encontram como
                      forma de resistência e celebração.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                      Mais do que roupas, nossas peças carregam narrativas que
                      valorizam a identidade, a diversidade e a potência
                      cultural das comunidades. Aqui, moda é instrumento de
                      expressão e também um meio de fortalecer tradições que
                      muitas vezes não encontram espaço na grande indústria.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Mas não paramos na estética. Em cada venda, uma parte do
                      valor é revertida para projetos sociais que apoiam jovens
                      talentos, artistas locais e iniciativas comunitárias,
                      criando uma rede de impacto que vai além da moda. Ao
                      escolher nossas camisetas, você se conecta a uma corrente
                      de solidariedade que acredita no poder da cultura para
                      transformar realidades. Nosso compromisso é unir estilo,
                      consciência social e orgulho periférico em um mesmo
                      movimento, mostrando que quando a rua veste sua própria
                      história, ela também abre caminhos para um futuro mais
                      justo e coletivo.
                    </p>
                  </div>
                </div>
              </section>

              {/* CONTATO SECTION */}
              <section className="py-16 px-4 bg-azul-gelo w-full" id="contato">
                <div className="max-w-4xl mx-auto w-full">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-black mb-4 text-gray-900">
                      ENTRE EM CONTATO COM NOSSA{" "}
                      <span className="text-verde-neon">EQUIPE!</span>
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Discuta sua curiosidade sobre o projeto, ou faça parte com
                      novas soluções!
                    </p>
                  </div>

                  <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-white w-full">
                    {" "}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-verde-neon">
                          Nome
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Seu nome completo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2 text-verde-neon">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2 text-verde-neon">
                          Mensagem
                        </label>
                        <textarea
                          required
                          rows="5"
                          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Conte-nos sobre sua ideia ou projeto..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-verde-rua hover:bg-verde-neon text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        ENVIAR MENSAGEM
                      </button>
                    </form>
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="bg-black text-white py-12 px-4 w-full">
                <div className="max-w-6xl mx-auto w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <h4 className="font-bold text-lg mb-4 text-verde-neon">
                        FUNCIONALIDADES
                      </h4>
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          Produtos
                        </a>
                        <a
                          href="#"
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          Pagamento
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4 text-verde-neon">
                        SUPORTE
                      </h4>
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          Fale conosco
                        </a>
                        <a
                          href="#"
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          FAQ
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4 text-verde-neon">
                        LEGAL
                      </h4>
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          Política de privacidade
                        </a>
                        <a
                          href="#"
                          className="block text-gray-400 hover:text-white transition-colors"
                        >
                          Termos de uso
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-xl font-black">
                      VISTA <span className="text-verde-neon">CULTURA</span>.
                      APOIE A{" "}
                      <span className="text-verde-neon">COMUNIDADE</span>.
                    </p>
                    <p className="text-gray-400 mt-2">
                      © 2025 Camisa de Rua Store. Todos os direitos reservados.
                    </p>
                  </div>
                </div>
              </footer>

              {/* Modal de Login na Landing Page */}
              <ModalAuth
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          }
        />

        {/* Rota da Home (protegida) */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/" replace />}
        />

        {/* Redirecionamento para raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
