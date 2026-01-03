    /* --- DATA MANAGEMENT --- */
    function loadSavedPlaces() { 
        try { 
            const raw = localStorage.getItem('travelmaps:saved'); 
            const places = raw ? JSON.parse(raw) : [];
            // Ensure all places have memories array to prevent crashes
            return places.map(p => ({
                ...p, 
                memories: p.memories || []
            }));
        } catch (e) { 
            console.error('Error loading saved places:', e);
            return []; 
        } 
    }
    
    function savePlaces() { 
        try {
            const dataString = JSON.stringify(savedPlaces);
            localStorage.setItem('travelmaps:saved', dataString);
            console.log("Data saved successfully!");
        } catch (e) {
            console.error('Error saving places:', e);
            if (e.name === 'QuotaExceededError') {
                alert('Storage is full! Try deleting some old images or notes. Images take up a lot of space.');
            }
        }
    }

    function renderSavedList() {
        savedList.innerHTML = '';
        
        if (!savedPlaces || savedPlaces.length === 0) { 
            const p = document.createElement('div'); 
            p.className = 'result-sub'; 
            p.textContent = 'No saved places yet.'; 
            savedList.appendChild(p); 
            return; 
        }
        
        // Re-add markers to map if they aren't there (important for persistence)
        savedPlaces.forEach(place => {
            if (!savedMarkers[place.id]) {
                addSavedMarker(place);
            }

            const card = document.createElement('div'); 
            card.className = 'saved-card';
            
            const left = document.createElement('div'); 
            left.className = 'saved-left';
            
            const t = document.createElement('div'); 
            t.className = 'saved-title'; 
            t.textContent = place.name || place.formatted || 'Place';
            
            const s = document.createElement('div'); 
            s.className = 'saved-sub'; 
            const memCount = place.memories ? place.memories.length : 0;
            s.textContent = `${place.formatted || `${place.lat.toFixed(4)}, ${place.lon.toFixed(4)}`} • ${memCount} memories`;
            
            left.appendChild(t); 
            left.appendChild(s);
            
            const actions = document.createElement('div'); 
            actions.className = 'saved-actions';
            
            const memBtn = document.createElement('button');
            memBtn.className = 'small-btn';
            memBtn.textContent = '📸';
            memBtn.title = 'View Memories';
            memBtn.onclick = () => openMemoriesModal(place.id);
            
            const goBtn = document.createElement('button'); 
            goBtn.className = 'small-btn'; 
            goBtn.textContent = 'Go'; 
            goBtn.onclick = () => { 
                map.setView([place.lat, place.lon], 15); 
                if (savedMarkers[place.id]) savedMarkers[place.id].openPopup(); 
            };
            
            const delBtn = document.createElement('button'); 
            delBtn.className = 'small-btn'; 
            delBtn.textContent = 'Delete'; 
            delBtn.onclick = () => { 
                if (!confirm('Delete this saved place and all its memories?')) return; 
                savedPlaces = savedPlaces.filter(p => p.id !== place.id); 
                savePlaces(); 
                removeSavedMarker(place.id); 
                renderSavedList(); 
            };
            
            actions.appendChild(memBtn);
            actions.appendChild(goBtn); 
            actions.appendChild(delBtn);
            
            card.appendChild(left); 
            card.appendChild(actions); 
            savedList.appendChild(card);
        });
    }
