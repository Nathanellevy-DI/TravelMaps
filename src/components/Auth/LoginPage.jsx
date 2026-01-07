import { useState } from 'react';
import { LogIn, UserPlus, Map, HelpCircle, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import HowToUseModal from '../UI/HowToUseModal';
import './LoginPage.css';

export default function LoginPage() {
    const { login, register, error, clearError } = useAuth();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isHowToOpen, setIsHowToOpen] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        // Validation
        if (!email.trim()) {
            setLocalError('Email is required');
            return;
        }
        if (!password) {
            setLocalError('Password is required');
            return;
        }
        if (isRegisterMode) {
            if (password.length < 6) {
                setLocalError('Password must be at least 6 characters');
                return;
            }
            if (password !== confirmPassword) {
                setLocalError('Passwords do not match');
                return;
            }
        }

        setIsLoading(true);

        try {
            if (isRegisterMode) {
                await register(email, password, name || 'Traveler');
            } else {
                await login(email, password);
            }
        } catch (err) {
            // Error is handled by AuthContext
            console.error('Auth error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setLocalError('');
        clearError();
    };

    const displayError = localError || error;

    return (
        <div className="login-container">
            {/* Animated background orbs */}
            <div className="login-bg-orb login-bg-orb-1"></div>
            <div className="login-bg-orb login-bg-orb-2"></div>
            <div className="login-bg-orb login-bg-orb-3"></div>

            <div className="login-card">
                <div className="login-logo">
                    <Map size={56} />
                </div>
                <h1 className="login-title">TravelMaps</h1>
                <p className="login-subtitle">
                    {isRegisterMode
                        ? 'Create your account to start exploring'
                        : 'Welcome back, explorer'}
                </p>

                {displayError && (
                    <div className="login-error">
                        <AlertCircle size={16} />
                        <span>{displayError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegisterMode && (
                        <div className="input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Your name (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            autoComplete={isRegisterMode ? "new-password" : "current-password"}
                            required
                        />
                    </div>

                    {isRegisterMode && (
                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                className="login-input"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="spin" />
                                {isRegisterMode ? 'Creating Account...' : 'Signing In...'}
                            </>
                        ) : (
                            <>
                                {isRegisterMode ? 'Create Account' : 'Sign In'}
                                {isRegisterMode ? <UserPlus size={20} /> : <LogIn size={20} />}
                            </>
                        )}
                    </button>
                </form>

                <div className="login-divider">
                    <span>or</span>
                </div>

                <button
                    className="login-toggle-btn"
                    onClick={toggleMode}
                    disabled={isLoading}
                >
                    {isRegisterMode
                        ? 'Already have an account? Sign In'
                        : "Don't have an account? Register"}
                </button>

                <button
                    className="login-help-btn"
                    onClick={() => setIsHowToOpen(true)}
                    disabled={isLoading}
                >
                    <HelpCircle size={18} /> How to Use
                </button>
            </div>

            <HowToUseModal isOpen={isHowToOpen} onClose={() => setIsHowToOpen(false)} />
        </div>
    );
}
