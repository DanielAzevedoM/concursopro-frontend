import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Hash } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import goldLogo from '../assets/gold_logo_blue.svg';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await AuthService.forgotPassword(email);
      setSuccess('Se o e-mail existir, um código foi gerado. Verifique no console do backend!');
      setStep(2);
    } catch (err: any) {
      setError('Ocorreu um erro ao processar sua solicitação.');
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      await AuthService.resetPassword(email, code, newPassword);
      setSuccess('Senha alterada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/'), 3000);
    } catch (err: any) {
      setError('Código inválido ou expirado.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background flares */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-[400px] w-full space-y-8 bg-primary-800 p-10 rounded-3xl shadow-2xl border border-gray-700/50 relative z-10">
        <div>
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <img src={goldLogo} alt="ConcursoPro Ouro" className="w-64 h-auto object-contain -mb-4" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {step === 1 ? 'Digite seu e-mail para receber o código' : 'Digite o código recebido e a nova senha'}
          </p>
        </div>

        {step === 1 ? (
          <form className="mt-8 space-y-5" onSubmit={handleSendCode}>
            {error && <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900/50 p-2 rounded-lg">{error}</div>}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" strokeWidth={2} />
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

            <div className="mt-8">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border-0 text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#4c1d95] to-[#ca8a04] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ca8a04] shadow-lg transition-all"
              >
                Enviar Código
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
            {error && <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900/50 p-2 rounded-lg">{error}</div>}
            {success && <div className="text-green-400 text-sm text-center bg-green-950/50 border border-green-900/50 p-2 rounded-lg">{success}</div>}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border-0 bg-white placeholder-gray-500 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm font-medium"
                  placeholder="Código de 6 dígitos"
                  value={code}
                  onChange={e => setCode(e.target.value)}
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
                  placeholder="Nova Senha"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border-0 text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#4c1d95] to-[#ca8a04] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ca8a04] shadow-lg transition-all"
              >
                Alterar Senha
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gold hover:text-gold-hover transition-colors">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
