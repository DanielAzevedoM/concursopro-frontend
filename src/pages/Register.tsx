import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import goldLogo from '../assets/gold_logo_blue.svg';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background flares */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-[400px] w-full space-y-8 bg-primary-800 p-10 rounded-3xl shadow-2xl border border-gray-700/50 relative z-10">
        <div>
          <div className="flex flex-col items-center justify-center cursor-pointer mb-2">
            <img src={goldLogo} alt="ConcursoPro Ouro" className="w-40 h-auto object-contain mb-2" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            É rápido e gratuito
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          {error && <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900/50 p-2 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                required
                className="appearance-none block w-full pl-11 pr-4 py-3.5 border-0 bg-white placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm font-medium"
                placeholder="Nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="email"
                required
                className="appearance-none block w-full pl-11 pr-4 py-3.5 border-0 bg-white placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm font-medium"
                placeholder="Seu e-mail"
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
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border-0 text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#4c1d95] to-[#ca8a04] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ca8a04] shadow-lg transition-all"
            >
              Criar Conta
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Já tem conta? <span className="text-gold font-medium">Faça Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
