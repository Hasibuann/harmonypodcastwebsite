document.addEventListener('DOMContentLoaded', () => {
    // Initialize WaveSurfer
    const wavesurfer1 = WaveSurfer.create({
        container: '#waveform1',
        waveColor: '#4caf50',
        progressColor: '#1db954'
    });
    wavesurfer1.load('Photo Landing Page/Eps 1 Poster IG.mp4'); // Perbaiki path

    // Player Update Logic
    const episodeList = document.querySelectorAll('.episode-list li');
    const playerTitle = document.getElementById('player-title');
    const playerCover = document.getElementById('player-cover');
    const playerDuration = document.getElementById('player-duration');

    episodeList.forEach(item => {
        item.addEventListener('click', () => {
            // Update the player
            playerTitle.textContent = item.dataset.title;
            playerCover.src = item.dataset.cover;
            playerDuration.textContent = item.dataset.duration;

            // Reset active state
            episodeList.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Hamburger Toggle
    const navbar = document.querySelector('header.navbar');
    const hamburger = navbar ? navbar.querySelector('.hamburger') : null;
    const computedStyles = hamburger ? window.getComputedStyle(hamburger) : {};
    const data = {
        hamburgerExists: !!hamburger,
        hamburgerStyles: hamburger ? {
            display: computedStyles.display,
            visibility: computedStyles.visibility,
            // Other potentially relevant styles can be added here.
        } : null,
        eventListeners: hamburger ? getEventListeners(hamburger) : null,
        mediaQueries: Array.from(document.styleSheets).reduce((acc, sheet) => {
          try {
            return acc.concat(Array.from(sheet.cssRules)
              .filter(rule => rule instanceof CSSMediaRule)
              .map(rule => ({
                media: rule.media.mediaText,
                cssText: rule.cssText,
              })));
          } catch (e) {
            console.warn('Could not access cssRules from stylesheet', sheet.href, e);
            return acc;
          }
        }, []),
    };
    
    function getEventListeners(element) {
      const listeners = {};
      for (const key in element) {
        if (key.startsWith('__reactEventHandlers$')) {
          const eventHandlers = element[key];
          for (const prop in eventHandlers) {
            if (prop.startsWith('on')) {
              const eventName = prop.substring(2).toLowerCase();
              listeners[eventName] = listeners[eventName] || [];
              listeners[eventName].push(eventHandlers[prop]);
            }
          }
          break;
        }
      }
      if (Object.keys(listeners).length === 0) {
        const regularListeners = getRegularEventListeners(element);
        if (Object.keys(regularListeners).length > 0) {
          return regularListeners;
        } else {
          return null;
        }
      }
      return listeners;
    }
    
    function getRegularEventListeners(element) {
      const listeners = {};
      const eventTypes = ['click', 'mousedown', 'touchstart'];
      eventTypes.forEach(eventType => {
        listeners[eventType] = [];
        const eventListeners = getEventListenersForType(element, eventType);
        if (eventListeners && eventListeners.length) {
          listeners[eventType] = eventListeners;
        } else {
          delete listeners[eventType];
        }
      });
      return listeners;
    }
    
    function getEventListenersForType(element, type) {
      const listeners = [];
      const allListeners = getEventListenersList(element);
      if (allListeners && allListeners.length) {
        allListeners.forEach(listener => {
          if (listener.type === type) {
            listeners.push(listener);
          }
        });
      }
      return listeners;
    }
    
    function getEventListenersList(element) {
      return element.__listeners;
    }
});
