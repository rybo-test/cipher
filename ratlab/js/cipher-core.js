/**
 * C.I.P.H.E.R. Core State Engine (v3.8)
 * Manages player session, username, handheld hardware stats, and inventory.
 * Strictly adheres to approved terminology.
 */

const CipherCore = (function () {
  const STORAGE_KEY = 'cipher_handheld_state';

  const defaultState = {
    cacher: {
      username: 'FRIEND',
      isBuddy: false
    },
    hardware: {
      batteryVolts: 11.2,
      powerSupplyOk: false,
      ramBufferOk: false,
      cypherWheelAligned: false
    },
    bootstrapped: true,
    lastStage: 'STAGE_BOOT_CHECK'
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('CipherCore: Unable to read local storage, using defaults');
    }
    return Object.assign({}, defaultState);
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('CipherCore: Unable to save local storage');
    }
  }

  return {
    getState: function () {
      return state;
    },

    registerCallsign: function (name) {
      if (!name) return;
      state.cacher.username = name.trim().toUpperCase();
      state.bootstrapped = true;
      saveState();
    },

    setHardwareRepaired: function (part) {
      if (part === 'battery') {
        state.hardware.batteryVolts = 12.6;
        state.hardware.powerSupplyOk = true;
      }
      if (part === 'ram') {
        state.hardware.ramBufferOk = true;
      }
      if (part === 'wheel') {
        state.hardware.cypherWheelAligned = true;
      }

      if (state.hardware.powerSupplyOk && state.hardware.ramBufferOk && state.hardware.cypherWheelAligned) {
        state.cacher.isBuddy = true;
      }
      saveState();
    },

    resetSession: function () {
      state = Object.assign({}, defaultState);
      saveState();
    }
  };
})();
