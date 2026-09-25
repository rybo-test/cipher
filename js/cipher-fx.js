/**
 * C.I.P.H.E.R. Visual & Quantum FX Engine (v4.5)
 * Manages CRT brownouts, line collapse, screen tearing, and the Dual-Identity flip.
 */

const CipherFX = (function () {
  // Inject required dynamic animations if not already defined in CSS
  function ensureKeyframes() {
    if (document.getElementById('cipher-fx-styles')) return;

    const style = document.createElement('style');
    style.id = 'cipher-fx-styles';
    style.textContent = `
      /* --- Quantum Screen Tear & Chromatic Split --- */
      @keyframes cfxScreenTear {
        0% {
          transform: translate(0);
          filter: contrast(1) brightness(1);
        }
        20% {
          transform: translate(-8px, 4px) skewX(3deg);
          filter: invert(0.85) hue-rotate(90deg) contrast(2.2);
        }
        40% {
          transform: translate(8px, -5px) skewX(-4deg);
          filter: brightness(2.2) contrast(3);
        }
        60% {
          transform: translate(-4px, 2px);
          filter: invert(0.3) saturate(3.5);
        }
        80% {
          transform: translate(3px, -2px);
          filter: contrast(1.6);
        }
        100% {
          transform: translate(0);
          filter: contrast(1) brightness(1);
        }
      }

      .cfx-tearing {
        animation: cfxScreenTear 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94) both !important;
      }

      /* --- Ambient Micro Glitch --- */
      @keyframes cfxMicroSpike {
        0% { transform: translate(0); }
        30% { transform: translate(-2px, 1px) skewX(1deg); filter: contrast(1.4); }
        60% { transform: translate(2px, -1px); filter: brightness(1.3); }
        100% { transform: translate(0); filter: contrast(1); }
      }

      .cfx-micro-spike {
        animation: cfxMicroSpike 0.16s ease-out both !important;
      }

      /* --- Brownout & Collapse --- */
      @keyframes cfxBrownout {
        0% { filter: brightness(1) contrast(1); }
        40% { filter: brightness(0.25) contrast(1.8) hue-rotate(-20deg); }
        70% { filter: brightness(0.5) contrast(1.2); }
        100% { filter: brightness(1) contrast(1); }
      }

      .cfx-brownout {
        animation: cfxBrownout 0.6s ease-in-out both;
      }

      @keyframes cfxCollapse {
        0% { transform: scale(1, 1); opacity: 1; }
        50% { transform: scale(1, 0.004); opacity: 0.9; }
        80% { transform: scale(0.004, 0.004); opacity: 0.8; }
        100% { transform: scale(1, 1); opacity: 1; }
      }

      .cfx-collapsing {
        animation: cfxCollapse 0.5s cubic-bezier(0.77, 0, 0.175, 1) both;
      }
    `;
    document.head.appendChild(style);
  }

  // Ensure styles load on initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureKeyframes);
  } else {
    ensureKeyframes();
  }

  return {
    /**
     * Executes the Dual-Identity Quantum Flip (RSI <-> Rat Pack)
     * @param {HTMLElement} targetEl - The screen surface to animate
     * @param {Function} onMidpoint - Callback when screen is torn (swap styles/themes here)
     * @param {Function} onComplete - Callback after screen stabilizes
     */
    quantumFlip: function (targetEl, onMidpoint, onComplete) {
      ensureKeyframes();
      const el = targetEl || document.body;

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.buzz) CipherAudio.buzz();
        if (CipherAudio.keyThud) CipherAudio.keyThud();
      }

      el.classList.add('cfx-tearing');

      // Swap themes at peak tear
      setTimeout(() => {
        if (typeof onMidpoint === 'function') onMidpoint();

        setTimeout(() => {
          el.classList.remove('cfx-tearing');
          if (typeof onComplete === 'function') onComplete();
        }, 180);
      }, 140);
    },

    /**
     * Micro glitch flicker for ambient personality instability
     */
    glitchSpike: function (targetEl) {
      ensureKeyframes();
      const el = targetEl || document.body;
      el.classList.add('cfx-micro-spike');

      if (typeof CipherAudio !== 'undefined' && CipherAudio.lineChatter) {
        CipherAudio.lineChatter();
      }

      setTimeout(() => {
        el.classList.remove('cfx-micro-spike');
      }, 160);
    },

    /**
     * Power rail brownout animation
     */
    brownout: function (targetEl, callback) {
      ensureKeyframes();
      const el = targetEl || document.body;
      el.classList.add('cfx-brownout');

      setTimeout(() => {
        el.classList.remove('cfx-brownout');
        if (typeof callback === 'function') callback();
      }, 600);
    },

    /**
     * CRT beam horizontal collapse and bloom recovery
     */
    collapse: function (targetEl, callback) {
      ensureKeyframes();
      const el = targetEl || document.body;
      el.classList.add('cfx-collapsing');

      // Midpoint: beam is a flat sliver
      setTimeout(() => {
        if (typeof callback === 'function') callback();
      }, 250);

      setTimeout(() => {
        el.classList.remove('cfx-collapsing');
      }, 500);
    }
  };
})();
