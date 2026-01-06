// App version tracking for badge notifications
// Increment CURRENT_VERSION when you add new features
const CURRENT_VERSION = 1;
const STORAGE_KEY = 'travelmaps:lastSeenVersion';

export async function checkAndSetBadge() {
    // Check if Badge API is supported
    if (!('setAppBadge' in navigator)) {
        console.log('Badge API not supported');
        return;
    }

    try {
        const lastSeen = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        const unseenUpdates = CURRENT_VERSION - lastSeen;

        if (unseenUpdates > 0) {
            // Show badge with number of unseen updates
            await navigator.setAppBadge(unseenUpdates);
            console.log(`Badge set: ${unseenUpdates} new update(s)`);
        }
    } catch (error) {
        console.error('Error setting badge:', error);
    }
}

export async function clearBadge() {
    // Clear the badge and mark current version as seen
    if ('clearAppBadge' in navigator) {
        try {
            await navigator.clearAppBadge();
            localStorage.setItem(STORAGE_KEY, CURRENT_VERSION.toString());
            console.log('Badge cleared, version marked as seen');
        } catch (error) {
            console.error('Error clearing badge:', error);
        }
    } else {
        // Fallback: just update localStorage
        localStorage.setItem(STORAGE_KEY, CURRENT_VERSION.toString());
    }
}

// Check badge on page visibility change (coming back to app)
export function initBadgeTracking() {
    // Clear badge when user opens/focuses the app
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            clearBadge();
        }
    });

    // Also clear on initial load
    clearBadge();
}
