import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/api';

interface AuthContextType {
    user: any;
    login: (user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && currentUser.token) {
            setUser(currentUser);
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
