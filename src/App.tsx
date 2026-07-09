import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import AlertModal, { type AlertType } from './components/AlertModal';
import ScrollToTop from './components/ScrollToTop';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Premium from './pages/Premium';
import Contests from './pages/Contests';
import ContestDetails from './pages/ContestDetails';
import ExamSolve from './pages/ExamSolve';
import DashboardLayout from './layouts/DashboardLayout';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { signed, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  if (!signed) return <Navigate to="/" />;

  return children;
}

function GlobalAlert() {
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });

  useEffect(() => {
    const handleGlobalAlert = (e: Event) => {
      const customEvent = e as CustomEvent;
      setAlertConfig({
        isOpen: true,
        type: customEvent.detail.type || 'error',
        title: customEvent.detail.title || 'Aviso',
        message: customEvent.detail.message,
      });
    };
    window.addEventListener('global-alert', handleGlobalAlert);
    return () => window.removeEventListener('global-alert', handleGlobalAlert);
  }, []);

  return (
    <AlertModal
      isOpen={alertConfig.isOpen}
      type={alertConfig.type}
      title={alertConfig.title}
      message={alertConfig.message}
      onConfirm={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalAlert />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rotas protegidas (Layout com Sidebar) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Questions />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/premium"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Premium />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/concursos"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Contests />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/concursos/:id"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ContestDetails />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/prova/:id"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ExamSolve />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
