import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed or dismissed
        const dismissed = localStorage.getItem('travelmaps:install-dismissed');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (dismissed || isStandalone) {
            return;
        }

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        // Show iOS prompt after delay
        if (isIOSDevice && !isStandalone) {
            setTimeout(() => setShowPrompt(true), 3000);
            return;
        }

        // Listen for beforeinstallprompt (Android/Chrome)
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('travelmaps:install-dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="install-prompt">
            <div className="install-prompt-content">
                <Download size={24} className="install-icon" />
                <div className="install-text">
                    <strong>Install TravelMaps</strong>
                    {isIOS ? (
                        <span>Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong></span>
                    ) : (
                        <span>Add to your home screen for quick access</span>
                    )}
                </div>
                {!isIOS && (
                    <button className="install-btn primary" onClick={handleInstall}>
                        Install
                    </button>
                )}
                <button className="install-close" onClick={handleDismiss} aria-label="Dismiss">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
