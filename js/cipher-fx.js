/**
 * C.I.P.H.E.R. Visual & Quantum FX Engine (v5.0)
 * Module 01: Cache Tales Architecture
 * 
 * Manages CRT brownouts, beam line collapse, quantum screen tearing,
 * and the Dual-Identity glitch transitions (RSI 1980s Steelworker <-> Rat Pack Acme Overhaul).
 * Strictly adheres to Master Canon Section 3 & Section 5.1.
 */

const CipherFX = (function () {
  // Inject required dynamic animations if not already defined in DOM
  function ensureKeyframes() {
    if (document.getElementById('cipher-fx-styles')) return;

    const style = document.createElement('style');
    style.id = 'cipher-fx-styles';
    style.textContent = `
      /* =========================================================
         1. QUANTUM SCREEN TEAR & CHROMATIC SPLIT
         Dual-personality collision between P31 Phosphor & Acme Cyan
         ========================================================= */
      @keyframes cfxScreenTear {
        0% {
          transform: translate(0);
          filter: contrast(1) brightness(1);
        }
        15% {
          transform: translate(-10px, 4px) skewX(4deg);
          filter: invert(0.85) hue-rotate(90deg) contrast(2.5);
          box-shadow: inset 0 0 40px rgba(0, 255, 102, 0.4);
        }
        35% {
          transform: translate(12px, -6px) skewX(-5deg);
          filter: brightness(2.4) contrast(3) saturate(2);
          box-shadow: inset 0 0 50px rgba(0, 229, 255, 0.6);
        }
        55% {
          transform: translate(-6px, 3px) skewY(1.5deg);
          filter: invert(0.3) saturate(3.5) hue-rotate(180deg);
        }
        75% {
          transform: translate(4px, -2px);
          filter: contrast(1.8) brightness(1.2);
        }
        100% {
          transform: translate(0);
          filter: contrast(1) brightness(1);
          box-shadow: none;
        }
      }

      .cfx-tearing {
        animation: cfxScreenTear 0.34s cubic-bezier(0.25, 0.46, 0.45, 0.94) both !important;
        pointer-events: none;
      }

      /* =========================================================
         2. AMBIENT INSTABILITY & CARRIER MICRO-SPIKES
         Triggered by 433.92 MHz jitter or cold solder joint brownout
         ========================================================= */
      @keyframes cfxMicroSpike {
        0% { transform: translate(0); }
        25% { transform: translate(-3px, 1px) skewX(1.5deg); filter: contrast(1.4) brightness(1.1); }
        50% { transform: translate(3px, -1px) skewX(-1deg); filter: brightness(1.3) hue-rotate(15deg); }
        75% { transform: translate(-1px, 2px); filter: contrast(1.2); }
        100% { transform: translate(0); filter: contrast(1) brightness(1); }
      }

      .cfx-micro-spike {
        animation: cfxMicroSpike 0.16s ease-out both !important;
      }

      /* =========================================================
         3. 12V BENCH TAP BROWNOUT & RELAY SAG
         Lead-acid voltage dip below 12.0V
         ========================================================= */
      @keyframes cfxBrownout {
        0% { filter: brightness(1) contrast(1); }
        30% { filter: brightness(0.2) contrast(2) hue-rotate(-25deg); }
        60% { filter: brightness(0.55) contrast(1.3); }
        80% { filter: brightness(0.35) contrast(1.6); }
        100% { filter: brightness(1) contrast(1); }
      }

      .cfx-brownout {
        animation: cfxBrownout 0.65s ease-in-out both;
      }

      /* =========================================================
         4. CRT ELECTRON BEAM HORIZONTAL COLLAPSE
         Power rail cut / percussive casing impact response
         ========================================================= */
      @keyframes cfxCollapse {
        0% { transform: scale(1, 1); opacity: 1; filter: brightness(1); }
        45% { transform: scale(1, 0.003); opacity: 0.95; filter: brightness(3); }
        75% { transform: scale(0.003, 0.003); opacity: 0.85; filter: brightness(4); }
        90% { transform: scale(1, 0.003); opacity: 0.9; }
        100% { transform: scale(1, 1); opacity: 1; filter: brightness(1); }
      }

      .cfx-collapsing {
        animation: cfxCollapse 0.52s cubic-bezier(0.77, 0, 0.175, 1) both;
      }
    `;
    document.head.appendChild(style);
  }

  // Ensure keyframe injection occurs as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureKeyframes);
  } else {
    ensureKeyframes();
  }

  return {
    /**
     * Executes the Dual-Identity Quantum Flip (RSI Garage <-> Rat Pack Acme Overhaul)
     * @param {HTMLElement} targetEl - The screen or chassis surface to tear
     * @param {Function} onMidpoint - Callback when screen distortion is at maximum (swap themes here)
     * @param {Function} onComplete - Callback after screen stabilizes
     */
    quantumFlip: function (targetEl, onMidpoint, onComplete) {
      ensureKeyframes();
      const el = targetEl || document.body;

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.buzz) CipherAudio.buzz();
        if (CipherAudio.relay) CipherAudio.relay();
        else if (CipherAudio.keyThud) CipherAudio.keyThud();
      }

      el.classList.add('cfx-tearing');

      // Midpoint theme swap trigger at maximum tear
      setTimeout(() => {
        if (typeof onMidpoint === 'function') {
          onMidpoint();
        }

        setTimeout(() => {
          el.classList.remove('cfx-tearing');
          if (typeof onComplete === 'function') {
            onComplete();
          }
        }, 180);
      }, 150);
    },

    /**
     * Micro glitch flicker for ambient carrier noise or unstable firmware
     * @param {HTMLElement} targetEl - Target element to flicker
     */
    glitchSpike: function (targetEl) {
      ensureKeyframes();
      const el = targetEl || document.body;
      el.classList.add('cfx-micro-spike');

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.lineChatter) {
          CipherAudio.lineChatter();
        } else if (CipherAudio.click) {
          CipherAudio.click();
        }
      }

      setTimeout(() => {
        el.classList.remove('cfx-micro-spike');
      }, 160);
    },

    /**
     * Power rail brownout animation (simulates 12V bench tap voltage sag)
     * @param {HTMLElement} targetEl - Target element
     * @param {Function} callback - Optional callback on completion
     */
    brownout: function (targetEl, callback) {
      ensureKeyframes();
      const el = targetEl || document.body;
      el.classList.add('cfx-brownout');

      if (typeof CipherAudio !== 'undefined' && CipherAudio.buzz) {
        CipherAudio.buzz();
      }

      setTimeout(() => {
        el.classList.remove('cfx-brownout');
        if (typeof callback === 'function') {
          callback();
        }
      }, 650);
    },

    /**
     * CRT electron beam horizontal collapse and bloom recovery
     * @param {HTMLElement} targetEl - Target element
     * @param {Function} callback - Optional callback executed while beam is flattened
     */
    collapse: function (targetEl, callback) {
      ensureKeyframes();
      const el = targetEl || document.body;
      el.classList.add('cfx-collapsing');

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.clank) CipherAudio.clank();
        else if (CipherAudio.keyThud) CipherAudio.keyThud();
      }

      // Midpoint: beam is a flat horizontal line
      setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, 260);

      setTimeout(() => {
        el.classList.remove('cfx-collapsing');
      }, 520);
    }
  };
})();

// Attach to window object for global module accessibility
window.CipherFX = CipherFX;
