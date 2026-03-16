import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// AuthContext for managing user authentication and profile updates
export type UserRole = 'user' | 'staff' | 'admin';

interface Partner {
  id: string;
  code: string;
  name: string;
  type: 'center' | 'agent' | 'franchise';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  partner?: Partner; // Thông tin đối tác (nếu user thuộc đối tác)
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, partnerId?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock partners
const mockPartners: Record<string, Partner> = {
  DT001: {
    id: '1',
    code: 'DT001',
    name: 'Trung tâm Đăng kiểm Thủ Đức',
    type: 'center',
  },
  DT002: {
    id: '2',
    code: 'DT002',
    name: 'Đại lý Đăng kiểm Bình Thạnh',
    type: 'agent',
  },
  DT003: {
    id: '3',
    code: 'DT003',
    name: 'Nhượng quyền Đăng kiểm Quận 7',
    type: 'franchise',
  },
};

// Mock users for each role
const mockUsers: Record<UserRole, User> = {
  user: {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'user@dangkiem.vn',
    role: 'user',
    phone: '0123456789',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  },
  staff: {
    id: '2',
    name: 'Trần Văn B (Nhân viên)',
    email: 'staff@dangkiem.vn',
    role: 'staff',
    phone: '0987654321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  admin: {
    id: '3',
    name: 'Admin Hệ Thống',
    email: 'admin@dangkiem.vn',
    role: 'admin',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
};

// Named export for AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dangkiem_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('dangkiem_user');
      }
    }
  }, []);

  const login = (role: UserRole, partnerId?: string) => {
    const loggedInUser = { ...mockUsers[role] }; // Create a copy to avoid mutating the original
    if (partnerId && mockPartners[partnerId]) {
      loggedInUser.partner = mockPartners[partnerId];
    }
    setUser(loggedInUser);
    localStorage.setItem('dangkiem_user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dangkiem_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('dangkiem_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Named export for useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export types
export type { User, Partner, AuthContextType };