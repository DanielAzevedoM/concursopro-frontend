import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Premium from './pages/Premium';
import DashboardLayout from './layouts/DashboardLayout';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { signed, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  if (!signed) return <Navigate to="/" />;
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
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
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
