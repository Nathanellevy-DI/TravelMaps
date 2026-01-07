/**
 * Authentication Context for TravelMaps
 * Provides auth state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const profile = await authService.getProfile();
                    setUser(profile.user || profile);
                    localStorage.setItem('travelmaps:user', JSON.stringify(profile.user || profile));
                } catch (err) {
                    console.error('Auth check failed:', err);
                    // Token might be expired, clear it
                    authService.logout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Listen for logout events
    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const register = async (email, password, name) => {
        setError(null);
        try {
            const data = await authService.register(email, password, name);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        clearError: () => setError(null),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
