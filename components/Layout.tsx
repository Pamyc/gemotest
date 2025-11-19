import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Building, 
  DollarSign, 
  PieChart, 
  GitCommit, 
  Users, 
  LogOut, 
  Menu,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../App';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col flex-shrink-0 z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
          {sidebarOpen ? (
            <h1 className="text-white font-bold text-xl tracking-wider">PROP<span className="text-blue-500">TECH</span></h1>
          ) : (
            <h1 className="text-blue-500 font-bold text-xl">P</h1>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <SidebarItem to="/" icon={LayoutDashboard} label={sidebarOpen ? "Dashboard" : ""} />
          <SidebarItem to="/projects" icon={Building2} label={sidebarOpen ? "Complexes" : ""} />
          <SidebarItem to="/buildings" icon={Building} label={sidebarOpen ? "Buildings" : ""} />
          <SidebarItem to="/finance" icon={DollarSign} label={sidebarOpen ? "Finance" : ""} />
          <SidebarItem to="/sales" icon={PieChart} label={sidebarOpen ? "Sales" : ""} />
          <SidebarItem to="/timeline" icon={GitCommit} label={sidebarOpen ? "Timeline" : ""} />
          
          {user?.role === 'ADMIN' && (
             <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="px-4 mb-2 text-xs uppercase text-slate-500 font-semibold">
                  {sidebarOpen ? "Administration" : "Admin"}
                </div>
                <SidebarItem to="/admin" icon={Users} label={sidebarOpen ? "Users" : ""} />
             </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800">
           <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
           >
             <LogOut size={18} />
             {sidebarOpen && <span>Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-800 p-1 rounded">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-800">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
              </div>
              <img 
                src={user?.avatarUrl || "https://via.placeholder.com/40"} 
                alt="User" 
                className="w-9 h-9 rounded-full border border-slate-200" 
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};