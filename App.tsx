import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Finance } from './pages/Finance';
import { Timeline } from './pages/Timeline';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { api } from './services/api';
import { User } from './types';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // In a real app, check localStorage/cookies for token on mount
  
  const login = async (email: string) => {
    const response = await api.auth.login(email);
    setUser(response.user);
    // Set token in local storage/cookie
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// --- App ---
const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="buildings" element={<div className="p-10 text-center text-slate-500">Buildings Module (Similar to Projects)</div>} />
                    <Route path="finance" element={<Finance />} />
                    <Route path="sales" element={<div className="p-10 text-center text-slate-500">Sales Module (Similar to Finance)</div>} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;