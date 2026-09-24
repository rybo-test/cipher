/**
 * C.I.P.H.E.R. Universal CRT Glitch & Visual FX Engine (v1.0 - CT-105 Audited)
 * Provides screen-wide analog hardware breakdown simulations:
 * - Vertical Raster Beam Collapse (Deflection circuit sync loss)
 * - Power Rail Brownout Sag (Low-voltage transformer drop)
 * - Phosphor Jitter & Scanline Shear
 */

const CipherFX = (function () {
  let styleInjected = false;

  function injectGlitchStyles() {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.id = 'cipher-fx-styles';
    style.textContent = `
      /* CRT Full-Screen Deflection Beam Overlay */
      .fx-raster-beam {
        position: fixed;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: #ffffff;
        box-shadow: 0 0 15px #00ff66, 0 0 30px #ffffff;
        opacity: 0;
        z-index: 999999;
        pointer-events: none;
        transform: translateY(-50%);
      }

      /* Vertical Raster Collapse Animation */
      @keyframes crt-collapse-in {
        0% { transform: scale(1, 1); filter: brightness(1); }
        45% { transform: scale(1.02, 0.005); filter: brightness(3); opacity: 1; }
        55% { transform: scale(0.01, 0.005); filter: brightness(4); opacity: 1; }
        70% { transform: scale(0, 0); opacity: 0; }
        100% { transform: scale(0, 0); opacity: 0; }
      }

      @keyframes crt-bloom-out {
        0% { transform: scale(0.01, 0.005); filter: brightness(4); opacity: 1; }
        40% { transform: scale(1.03, 0.008); filter: brightness(2.5); opacity: 1; }
        70% { transform: scale(0.98, 1.02); filter: brightness(1.2); opacity: 1; }
        100% { transform: scale(1, 1); filter: brightness(1); opacity: 1; }
      }

      /* Brownout Power Rail Undervoltage Sag */
      @keyframes brownout-sag {
        0% { transform: scale(1); filter: brightness(1); }
        15% { transform: scale(0.96, 0.95) skewX(1deg); filter: brightness(0.4) contrast(1.4) sepia(0.8) hue-rotate(-50deg); }
        30% { transform: scale(0.94, 0.96) skewX(-1.5deg); filter: brightness(0.3) contrast(1.6) sepia(0.9) hue-rotate(-60deg); }
        45% { transform: scale(0.97, 0.94) skewX(2deg); filter: brightness(0.45) contrast(1.3) sepia(0.7) hue-rotate(-40deg); }
        75% { transform: scale(0.95, 0.97) skewX(-0.5deg); filter: brightness(0.35) contrast(1.5) sepia(0.8) hue-rotate(-50deg); }
        90% { transform: scale(1.01, 0.99); filter: brightness(1.2); }
        100% { transform: scale(1); filter: brightness(1); }
      }

      /* Micro Phosphor Jitter */
      @keyframes phosphor-micro-jitter {
        0% { transform: translate(0, 0); }
        20% { transform: translate(-3px, 1px) skewX(1.2deg); }
        40% { transform: translate(2px, -2px) skewX(-1deg); }
        60% { transform: translate(-2px, 0px) skewX(0.8deg); }
        80% { transform: translate(1px, 2px) skewX(-0.5deg); }
        100% { transform: translate(0, 0); }
      }

      .fx-anim-collapse {
        animation: crt-collapse-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
      }
      .fx-anim-bloom {
        animation: crt-bloom-out 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
      }
      .fx-anim-brownout {
        animation: brownout-sag 0.85s ease-in-out forwards !important;
      }
      .fx-anim-jitter {
        animation: phosphor-micro-jitter 0.18s ease-in-out !important;
      }
    `;
    document.head.appendChild(style);
    styleInjected = true;
  }

  return {
    init: function () {
      injectGlitchStyles();
    },

    /**
     * Vertical Raster Collapse
     * Collapses the screen into a single horizontal flyback line, invokes onMidpoint, and blooms back out.
     * @param {HTMLElement} targetEl Target container (defaults to body or .app-viewport-shell)
     * @param {Function} onMidpoint Callback invoked when screen is in total collapse
     */
    collapse: function (targetEl = null, onMidpoint = null) {
      injectGlitchStyles();
      const target = targetEl || document.querySelector('.app-viewport-shell') || document.body;

      // Create flyback raster line overlay
      const beam = document.createElement('div');
      beam.className = 'fx-raster-beam';
      document.body.appendChild(beam);

      if (typeof CipherAudio !== 'undefined') {
        CipherAudio.flybackPop();
      }

      target.classList.remove('fx-anim-bloom', 'fx-anim-collapse');
      void target.offsetWidth;
      target.classList.add('fx-anim-collapse');

      // Raster beam flash at peak collapse
      setTimeout(() => {
        beam.style.opacity = '1';
        beam.style.transition = 'opacity 0.08s ease';
        setTimeout(() => { beam.style.opacity = '0'; }, 80);

        if (typeof onMidpoint === 'function') {
          onMidpoint();
        }
      }, 350);

      // Re-bloom back to full raster
      setTimeout(() => {
        target.classList.remove('fx-anim-collapse');
        void target.offsetWidth;
        target.classList.add('fx-anim-bloom');

        setTimeout(() => {
          target.classList.remove('fx-anim-bloom');
          if (beam.parentNode) beam.parentNode.removeChild(beam);
        }, 400);
      }, 420);
    },

    /**
     * Power Rail Brownout Sag
     * Undervoltage sag: dimensions pinch, amber/red color shift, scanline tears.
     * @param {HTMLElement} targetEl Target container
     * @param {Function} onMidpoint Callback fired during lowest voltage sag
     */
    brownout: function (targetEl = null, onMidpoint = null) {
      injectGlitchStyles();
      const target = targetEl || document.querySelector('.app-viewport-shell') || document.body;

      if (typeof CipherAudio !== 'undefined') {
        CipherAudio.transformerHum(0.85, true);
        CipherAudio.squelchTail();
      }

      target.classList.remove('fx-anim-brownout');
      void target.offsetWidth;
      target.classList.add('fx-anim-brownout');

      if (typeof onMidpoint === 'function') {
        setTimeout(onMidpoint, 380);
      }

      setTimeout(() => {
        target.classList.remove('fx-anim-brownout');
      }, 850);
    },

    /**
     * Micro Phosphor Jitter
     * Quick horizontal twitch for subtle narrative moments.
     */
    jitter: function (targetEl = null) {
      injectGlitchStyles();
      const target = targetEl || document.querySelector('.app-viewport-shell') || document.body;
      target.classList.remove('fx-anim-jitter');
      void target.offsetWidth;
      target.classList.add('fx-anim-jitter');

      setTimeout(() => {
        target.classList.remove('fx-anim-jitter');
      }, 190);
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  CipherFX.init();
});
