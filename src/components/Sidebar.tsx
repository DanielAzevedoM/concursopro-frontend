import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Crown, LineChart, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';

interface SidebarProps {
  onItemClick?: () => void;
}

export default function Sidebar({ onItemClick }: SidebarProps = {}) {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Visão Geral', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Disciplinas', path: '/questions', icon: Book },
    { name: 'Premium', path: '/premium', icon: Crown },
    { name: 'Desempenho', path: '/performance', icon: LineChart },
    { name: 'Ajuda', path: '/help', icon: HelpCircle },
  ];

  return (
    <div className="h-full w-full bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Logo Section */}
        <div className="flex items-center justify-center cursor-pointer w-full">
          <img src={logo} alt="ConcursoPro Logo" className="w-full h-auto object-cover" />
        </div>
        <hr className="border-gray-200" />

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? 'bg-[#334155] text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div>
        <hr className="border-gray-200 mb-4" />
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">Plano {user?.planType}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-[#b91c1c] hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          <span>Sair da conta</span>
        </button>
      </div>
      </div>
    </div>
  );
}
