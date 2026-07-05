import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import goldLogo from '../assets/gold_logo_blue.svg';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('@ConcursoApp:rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
      
      if (rememberMe) {
        localStorage.setItem('@ConcursoApp:rememberEmail', email);
      } else {
        localStorage.removeItem('@ConcursoApp:rememberEmail');
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background flares (simulating the image) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-[400px] w-full space-y-8 bg-primary-800 p-10 rounded-3xl shadow-2xl border border-gray-700/50 relative z-10">
        <div>
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <img src={goldLogo} alt="ConcursoPro Ouro" className="w-64 h-auto object-contain -mb-4" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white leading-tight">ConcursoPro</span>
              <span className="text-xs text-gray-400 font-medium tracking-wide">Sua aprovação começa aqui.</span>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-300">
            Faça login para continuar
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          {error && <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900/50 p-2 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="email"
                required
                className="appearance-none block w-full pl-11 pr-4 py-3.5 border-0 bg-white placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm font-medium"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="password"
                required
                className="appearance-none block w-full pl-11 pr-4 py-3.5 border-0 bg-white placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm font-medium"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-gold focus:ring-gold border-gray-600 bg-primary-900 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-gold hover:text-gold-hover transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border-0 text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#4c1d95] to-[#ca8a04] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ca8a04] shadow-lg transition-all"
            >
              Entrar
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">
            Não tem conta? <span className="text-gold font-medium">Cadastre-se</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
