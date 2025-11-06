import React, { useState } from "react";
const API_URL = "http://localhost:4000/api";

const ModalAuth = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleCadastro();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const { email, senha } = formData;

    if (!email || !senha) {
      throw new Error("Preencha todos os campos");
    }

    // Tenta fazer o login na API
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // O backend espera 'password', não 'senha'
      body: JSON.stringify({ email: email, password: senha }),
    });

    // Pega a resposta da API
    const data = await response.json();

    // Se a API deu erro (ex: senha errada), mostre o erro
    if (!response.ok) {
      throw new Error(data.error || "Erro ao tentar fazer login");
    }

    // Se deu certo, salve os dados no localStorage
    // O backend retorna { user, accessToken }
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);

    // 5. Chama a função que fecha o modal e te leva pra Home
    onLoginSuccess(data.user);
  };

  const handleCadastro = async () => {
    const { nome, email, senha, confirmarSenha } = formData;

    // Validação dos dados
    if (!nome || !email || !senha || !confirmarSenha) {
      throw new Error("Preencha todos os campos");
    }
    if (senha.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }
    if (senha !== confirmarSenha) {
      throw new Error("As senhas não coincidem");
    }

    // Tenta criar a conta do usuario na API
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // O backend espera 'name' e 'password'
      body: JSON.stringify({ name: nome, email: email, password: senha }),
    });

    // 3. Pega a resposta
    const data = await response.json();

    // 4. Se deu erro (ex: email já existe), mostre o erro
    if (!response.ok) {
      throw new Error(data.error || "Erro ao tentar cadastrar");
    }
    // 5. Se deu certo, avise o usuário e mude para o login
    alert("Cadastro realizado com sucesso! Por favor, faça o login.");
    switchToLogin();

    // NOTA: O endpoint de cadastro NÃO loga o usuário automaticamente,
    // ele só cria a conta.
    // Pedir para ele logar é o caminho mais simples.
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const switchToCadastro = () => {
    setIsLogin(false);
    setFormData({ ...formData, confirmarSenha: "" });
    setError("");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setFormData({ ...formData, confirmarSenha: "" });
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-green-900 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Fazer Login" : "Criar Conta"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2 text-green-900">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2 text-green-900">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-green-900">
              Senha
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Sua senha"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2 text-green-900">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Confirme sua senha"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-green-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>

          <div className="text-center pt-4 border-t border-gray-300">
            {isLogin ? (
              <p className="text-gray-600">
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={switchToCadastro}
                  className="text-green-900 font-bold hover:text-green-700"
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-green-900 font-bold hover:text-green-700"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAuth;
