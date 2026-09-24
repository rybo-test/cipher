/**
 * C.I.P.H.E.R. Core State & Independent Hardware Evolution Engine (v3.9)
 * Manages independent CPU, RAM, and Battery power scaling, scavenger ingestion,
 * feature unlock thresholds, the first-run zero-state gate, and factory rebooting.
 */

const CipherCore = (function () {
  const STORAGE_KEY = 'CIPHER_STATE_V38';
  const CLOUD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzrzQ2MAKNRt79dW478pfcX0A0n3InlojyfEPIZoTkq9c34N74z5hkwheYMz4MCRz60/exec';

  const defaultState = {
    bootstrapped: false,
    cacher: {
      username: 'GUEST_CACHER',
      syncKey: 'CT-INIT-0000',
      totalFinds: 0
    },
    hardware: {
      cpuMHz: 1.77,           // Baseline MOS 6502 (Upgrades: +0.25MHz, +0.5MHz, +1MHz...)
      ramKB: 64,              // Baseline 64KB (Upgrades: +4KB, +8KB, +16KB, +32KB...)
      batteryVolts: 11.8,     // Baseline Brownout Risk (Upgrades: +0.1V, +0.2V, +0.5V...)
      floatStatus: 'BROWNOUT_WARNING' // 'BROWNOUT_WARNING' | 'STABILIZED' | 'FLOAT_OK' | 'SOLAR_FLOAT' | 'OVERDRIVE'
    },
    campaign: {
      currentSector: 'SECTOR_01',
      currentLocationId: 'LOC_01_TURNAROUND',
      activeStageIndex: 0,
      completedCaches: [],
      unlockedWaypoints: ['LOC_01_TURNAROUND']
    },
    inventory: [
      {
        id: 'TOOL_ROT13',
        type: 'TOOL',
        name: 'Rot13 Field Decoder Card',
        desc: 'Interactive dual-rotor encryption wheel for shifting cipher letters.',
        consumable: false,
        icon: '⚙️',
        badge: 'Swag // TOOL-01'
      },
      {
        id: 'PART_RAM_4KB',
        type: 'PART',
        name: '4KB Static RAM DIP Chip',
        desc: 'Ceramic memory salvaged from ammo can chassis. Feeds +4KB to C.I.P.H.E.R.',
        consumable: true,
        targetPillar: 'ramKB',
        increment: 4,
        icon: '💾',
        badge: 'Hardware // PART'
      },
      {
        id: 'PART_TRIMMER_CAP',
        type: 'PART',
        name: 'Quartz Trimmer Capacitor',
        desc: 'Aerospace timing circuit component. Feeds +0.25 MHz to CPU clock.',
        consumable: true,
        targetPillar: 'cpuMHz',
        increment: 0.25,
        icon: '⚡',
        badge: 'Hardware // PART'
      }
    ],
    secrets: {
      ratLairDiscovered: false,
      ratLabUnlocked: false,
      ratBrainUnlocked: false
    },
    meta: {
      failedAttempts: 0,
      theme: 'crt',
      fontSize: 'large'
    }
  };

  let state = loadLocalState();

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return Object.assign({}, defaultState, JSON.parse(raw));
      }
    } catch (e) {
      console.warn('CipherCore: Local storage unavailable, falling back to defaults.');
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function persistLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('CipherCore: Failed saving local state.', e);
    }
  }

  function updateFloatStatus() {
    const v = state.hardware.batteryVolts;
    if (v < 12.0) state.hardware.floatStatus = 'BROWNOUT_WARNING';
    else if (v < 12.5) state.hardware.floatStatus = 'STABILIZED';
    else if (v < 13.0) state.hardware.floatStatus = 'FLOAT_OK';
    else if (v < 13.8) state.hardware.floatStatus = 'SOLAR_FLOAT';
    else state.hardware.floatStatus = 'OVERDRIVE';
  }

  function applyPreferences() {
    const root = document.documentElement;
    const body = document.body;
    const currentTheme = state.meta.theme || 'crt';
    const currentFont = state.meta.fontSize || 'large';

    if (currentTheme === 'blueprint') {
      body.classList.add('theme-blueprint');
      root.classList.add('theme-blueprint');
    } else {
      body.classList.remove('theme-blueprint');
      root.classList.remove('theme-blueprint');
    }

    body.classList.remove('font-regular', 'font-large', 'font-xl');
    root.classList.remove('font-regular', 'font-large', 'font-xl');

    if (currentFont === 'regular') {
      body.classList.add('font-regular');
      root.classList.add('font-regular');
    } else if (currentFont === 'xl') {
      body.classList.add('font-xl');
      root.classList.add('font-xl');
    } else {
      body.classList.add('font-large');
      root.classList.add('font-large');
    }

    window.dispatchEvent(new CustomEvent('cipher-preference-change', { detail: state }));
  }

  return {
    getState: function () {
      return state;
    },

    // Zero-State Gatekeeper (Redirects un-booted cachers to boot.html)
    enforceBootstrapGate: function () {
      const isBootPage = window.location.pathname.endsWith('boot.html');
      if (!state.bootstrapped && !isBootPage) {
        window.location.replace('boot.html');
      }
    },

    // Factory Reset & Cold Reboot Subroutine
    factoryReset: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
      } catch (e) {
        console.warn('CipherCore: Failed clearing storage.');
      }
      state = JSON.parse(JSON.stringify(defaultState));
      persistLocal();
      window.location.replace('boot.html');
    },

    // First-Run Bootstrap Registration
    bootstrapUser: function (username) {
      state.bootstrapped = true;
      state.cacher.username = username;
      const cleanTag = username.replace(/[^A-Z0-9]/g, '').substring(0, 4).padEnd(4, 'X');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      state.cacher.syncKey = `CT-${cleanTag}-${randomSuffix}`;
      persistLocal();
      this.commitMilestone('BOOTSTRAP_COMPLETE', { username: username, syncKey: state.cacher.syncKey });
      return state.cacher.syncKey;
    },

    // Independent Scavenger Upgrade Subroutine
    feedItemToCipher: function (itemId) {
      const itemIndex = state.inventory.findIndex(i => i.id === itemId);
      if (itemIndex === -1) return { success: false, reason: 'Item not found in pack.' };

      const item = state.inventory[itemIndex];

      if (item.type !== 'PART' || !item.consumable) {
        return { success: false, reason: 'Terminal rejects item. Only [PART] components can be fed to C.I.P.H.E.R.' };
      }

      let logMessage = '';

      if (item.targetPillar === 'ramKB') {
        state.hardware.ramKB += item.increment;
        logMessage = `RAM memory array expanded by +${item.increment}KB. Total: ${state.hardware.ramKB}KB.`;
      } else if (item.targetPillar === 'cpuMHz') {
        state.hardware.cpuMHz = Math.round((state.hardware.cpuMHz + item.increment) * 100) / 100;
        logMessage = `CPU bus frequency accelerated by +${item.increment} MHz. Clock: ${state.hardware.cpuMHz.toFixed(2)} MHz.`;
      } else if (item.targetPillar === 'batteryVolts') {
        state.hardware.batteryVolts = Math.round((state.hardware.batteryVolts + item.increment) * 10) / 10;
        updateFloatStatus();
        logMessage = `Power float increased by +${item.increment}V. Float status: ${state.hardware.batteryVolts.toFixed(1)}V (${state.hardware.floatStatus}).`;
      }

      if (state.hardware.ramKB >= 96 && !state.secrets.scratchpadUnlocked) {
        state.secrets.scratchpadUnlocked = true;
        logMessage += ' [FEATURE UNLOCKED: FIELD SCRATCHPAD]';
      }
      if (state.hardware.batteryVolts >= 12.6 && state.hardware.floatStatus !== 'BROWNOUT_WARNING') {
        logMessage += ' [CB SCANNER CALIBRATED // FULL RANGE ACQUIRED]';
      }

      state.inventory.splice(itemIndex, 1);
      updateFloatStatus();
      persistLocal();

      if (typeof CipherAudio !== 'undefined') {
        CipherAudio.chime();
        CipherAudio.speak(`Hardware upgraded. ${logMessage}`);
      }

      this.commitMilestone('FEED_HARDWARE', { itemId: item.id, hardware: state.hardware });

      return {
        success: true,
        message: `> HARDWARE ACCEPTED: ${item.name}\n> ${logMessage}`
      };
    },

    // 3-Strike "Human Bean" Snark Gate
    registerInputFailure: function () {
      state.meta.failedAttempts = (state.meta.failedAttempts || 0) + 1;
      persistLocal();

      if (state.meta.failedAttempts >= 3) {
        if (typeof CipherAudio !== 'undefined') {
          CipherAudio.buzz();
          CipherAudio.speak("Nice try, human bean. That code did not compute.");
        }
        return {
          snark: true,
          message: '> "Nice try, human bean. That code didn\'t even come close. Check your Rot13 wheel or review the hint."'
        };
      } else {
        if (typeof CipherAudio !== 'undefined') CipherAudio.buzz();
        return {
          snark: false,
          message: `> "Invalid code entered. Verification failed. (Attempt ${state.meta.failedAttempts} of 3)"`
        };
      }
    },

    resetFailureCounter: function () {
      state.meta.failedAttempts = 0;
      persistLocal();
    },

    setFontSize: function (size) {
      state.meta.fontSize = size;
      persistLocal();
      applyPreferences();
    },

    setTheme: function (theme) {
      state.meta.theme = theme;
      persistLocal();
      applyPreferences();
    },

    applyUserPreferences: applyPreferences,

    commitMilestone: function (actionType, payload) {
      persistLocal();

      const commitBody = {
        action: 'logFind',
        syncKey: state.cacher.syncKey,
        username: state.cacher.username,
        actionType: actionType,
        telemetry: JSON.stringify({
          milestone: actionType,
          payload: payload,
          hardware: state.hardware,
          timestamp: new Date().toISOString()
        })
      };

      fetch(CLOUD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commitBody)
      }).catch(err => {
        console.warn('CipherCore: Milestone queued locally.', err);
      });
    }
  };
})();

// Enforce preferences and bootstrap routing on load
document.addEventListener('DOMContentLoaded', () => {
  CipherCore.applyUserPreferences();
  CipherCore.enforceBootstrapGate();
});
