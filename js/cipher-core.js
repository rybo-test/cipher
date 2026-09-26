/**
 * C.I.P.H.E.R. Core State & Independent Hardware Evolution Engine (v5.0)
 * Module 01: Cache Tales Architecture
 * 
 * Manages independent CPU, RAM, and Battery power scaling, scavenger ingestion,
 * feature unlock thresholds, the first-run zero-state gate, and factory rebooting.
 * Strictly adheres to Master Canon Section 5.1 & Storage Schema.
 */

const CipherCore = (function () {
  const CONSOLIDATED_STORAGE_KEY = 'cipher_player_state';
  const LEGACY_STORAGE_KEYS = ['CIPHER_STATE_V38', 'cipher_callsign', 'cipher_clearance_level', 'cipher_font_size'];
  const CLOUD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzrzQ2MAKNRt79dW478pfcX0A0n3InlojyfEPIZoTkq9c34N74z5hkwheYMz4MCRz60/exec';

  const defaultState = {
    bootstrapped: false,
    cacher: {
      username: 'GUEST_CACHER',
      role: 'FRIEND',         // Operator Progression: 'FRIEND' (RSI) -> 'BUDDY' (Rat Pack)
      syncKey: 'CT-INIT-0000',
      totalFinds: 0,
      ftfCount: 0,
      tradeItemsLogged: 0
    },
    hardware: {
      cpuMHz: 1.77,           // Baseline MOS 6502 (Upgrades: +0.25MHz, +0.5MHz, +1MHz...)
      ramKB: 64,              // Baseline 64KB (Upgrades: +4KB, +8KB, +16KB, +32KB...)
      batteryVolts: 11.8,     // 12V Bench Tap Baseline (Brownout Risk below 12.0V)
      floatStatus: 'BROWNOUT_WARNING', // 'BROWNOUT_WARNING' | 'STABILIZED' | 'BENCH_FLOAT_OK' | 'SOLAR_FLOAT' | 'OVERDRIVE'
      subcarrierMHz: 433.92   // Benchmark carrier frequency
    },
    campaign: {
      currentSector: 'SECTOR_01',
      currentLocationId: 'LOC_01_TURNAROUND',
      activeStageIndex: 0,
      completedCaches: [],
      unlockedWaypoints: ['LOC_01_TURNAROUND'],
      fieldBonusCodes: []     // Bonus codes discovered on physical log sheets / swag tokens
    },
    inventory: [
      {
        id: 'TOOL_ROT13',
        type: 'TOOL',
        name: 'Rot13 Field Decoder Wheel',
        desc: 'Simulated rotary encryption dial for shifting cipher letters on the trail.',
        consumable: false,
        icon: '⚙️',
        badge: 'Swag // VIRTUAL-TOOL'
      },
      {
        id: 'PART_RAM_4KB',
        type: 'PART',
        name: '4KB Static RAM DIP Chip',
        desc: 'Ceramic memory salvaged from ammo can chassis. Feeds +4KB to virtual C.I.P.H.E.R. core.',
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
        desc: 'Aerospace timing circuit component from surplus lockbox. Feeds +0.25 MHz to CPU clock.',
        consumable: true,
        targetPillar: 'cpuMHz',
        increment: 0.25,
        icon: '⚡',
        badge: 'Hardware // PART'
      }
    ],
    secrets: {
      ratLairDiscovered: true,  // Machine lives in Rat Pack Lair
      ratLabUnlocked: false,
      ratBrainUnlocked: false,
      acmeBypassActive: false,
      scratchpadUnlocked: false
    },
    meta: {
      failedAttempts: 0,
      theme: 'rsi',             // 'rsi' (Monochrome Green) | 'ratpack' (Acme Cyan) | 'blueprint'
      fontSize: 'large'         // 'regular' (16px) | 'large' (19px trail high-vis) | 'xl' (22px direct sun)
    }
  };

  let state = loadLocalState();

  function loadLocalState() {
    try {
      // 1. Attempt primary consolidated storage load
      const raw = localStorage.getItem(CONSOLIDATED_STORAGE_KEY);
      if (raw) {
        return Object.assign({}, defaultState, JSON.parse(raw));
      }

      // 2. Fallback to legacy storage keys if present
      const legacyRaw = localStorage.getItem('CIPHER_STATE_V38');
      if (legacyRaw) {
        const parsed = JSON.parse(legacyRaw);
        const migrated = Object.assign({}, defaultState, parsed);
        // Normalize legacy role terminology if required
        if (migrated.cacher && !migrated.cacher.role) {
          migrated.cacher.role = 'FRIEND';
        }
        return migrated;
      }

      // 3. Fallback to individual legacy keys
      const callsign = localStorage.getItem('cipher_callsign');
      const fontSize = localStorage.getItem('cipher_font_size');
      if (callsign || fontSize) {
        const synthesized = JSON.parse(JSON.stringify(defaultState));
        if (callsign) {
          synthesized.cacher.username = callsign;
          synthesized.bootstrapped = true;
        }
        if (fontSize) {
          synthesized.meta.fontSize = fontSize.toLowerCase();
        }
        return synthesized;
      }
    } catch (e) {
      console.warn('[C.I.P.H.E.R. Core] Storage read failed; using defaults.', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function persistLocal() {
    try {
      localStorage.setItem(CONSOLIDATED_STORAGE_KEY, JSON.stringify(state));
      // Maintain backwards compatibility with legacy readers
      localStorage.setItem('cipher_callsign', state.cacher.username || 'GUEST_CACHER');
      localStorage.setItem('cipher_font_size', state.meta.fontSize || 'large');
      localStorage.setItem('CIPHER_STATE_V38', JSON.stringify(state));
    } catch (e) {
      console.error('[C.I.P.H.E.R. Core] Failed saving local state.', e);
    }
  }

  function updateFloatStatus() {
    const v = state.hardware.batteryVolts;
    if (v < 12.0) {
      state.hardware.floatStatus = 'BROWNOUT_WARNING';
    } else if (v < 12.5) {
      state.hardware.floatStatus = 'STABILIZED';
    } else if (v < 13.0) {
      state.hardware.floatStatus = 'BENCH_FLOAT_OK';
    } else if (v < 13.8) {
      state.hardware.floatStatus = 'SOLAR_FLOAT';
    } else {
      state.hardware.floatStatus = 'OVERDRIVE';
    }
  }

  function applyPreferences() {
    const root = document.documentElement;
    const body = document.body;
    if (!root || !body) return;

    const currentTheme = state.meta.theme || 'rsi';
    const currentFont = state.meta.fontSize || 'large';

    // Theme Surface Classes
    body.classList.remove('theme-rsi', 'theme-ratpack', 'theme-blueprint');
    root.classList.remove('theme-rsi', 'theme-ratpack', 'theme-blueprint');

    if (currentTheme === 'ratpack') {
      body.classList.add('theme-ratpack');
      root.classList.add('theme-ratpack');
    } else if (currentTheme === 'blueprint') {
      body.classList.add('theme-blueprint');
      root.classList.add('theme-blueprint');
    } else {
      body.classList.add('theme-rsi');
      root.classList.add('theme-rsi');
    }

    // High-Contrast Trail & Screen Font Classes
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

    /**
     * Operator Progression: Friend (RSI) -> Buddy (Rat Pack)
     */
    promoteOperator: function (newRole = 'BUDDY') {
      state.cacher.role = newRole;
      if (newRole === 'BUDDY') {
        state.secrets.acmeBypassActive = true;
        state.secrets.ratBrainUnlocked = true;
      }
      persistLocal();
      window.dispatchEvent(new CustomEvent('cipher-operator-promoted', { detail: state.cacher }));
      return state.cacher.role;
    },

    // Zero-State Gatekeeper (Redirects un-booted cachers to boot sequence)
    enforceBootstrapGate: function () {
      const isBootPage = window.location.pathname.endsWith('boot.html') || 
                         window.location.pathname.endsWith('index.html') || 
                         window.location.pathname === '/' || 
                         window.location.pathname === '';
      if (!state.bootstrapped && !isBootPage) {
        window.location.replace('../index.html');
      }
    },

    // Factory Reset & Cold Reboot Subroutine
    factoryReset: function () {
      try {
        localStorage.removeItem(CONSOLIDATED_STORAGE_KEY);
        LEGACY_STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
        sessionStorage.clear();
      } catch (e) {
        console.warn('[C.I.P.H.E.R. Core] Failed clearing storage:', e);
      }
      state = JSON.parse(JSON.stringify(defaultState));
      persistLocal();
      window.location.reload();
    },

    // First-Run Bootstrap Registration
    bootstrapUser: function (username) {
      state.bootstrapped = true;
      state.cacher.username = username || 'FELLOW_CACHER';
      state.cacher.role = 'FRIEND'; // Initial respectful RSI workshop greeting
      const cleanTag = state.cacher.username.replace(/[^A-Z0-9]/g, '').substring(0, 4).padEnd(4, 'X').toUpperCase();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      state.cacher.syncKey = `CT-${cleanTag}-${randomSuffix}`;
      persistLocal();
      this.commitMilestone('BOOTSTRAP_COMPLETE', { username: state.cacher.username, syncKey: state.cacher.syncKey });
      return state.cacher.syncKey;
    },

    // Scavenger Upgrade Subroutine for Virtual Hardware
    feedItemToCipher: function (itemId) {
      const itemIndex = state.inventory.findIndex(i => i.id === itemId);
      if (itemIndex === -1) return { success: false, reason: 'Item not found in pack inventory.' };

      const item = state.inventory[itemIndex];

      if (item.type !== 'PART' || !item.consumable) {
        return { success: false, reason: 'Terminal rejects item. Only simulated [PART] components can be fed to C.I.P.H.E.R.' };
      }

      let logMessage = '';

      if (item.targetPillar === 'ramKB') {
        state.hardware.ramKB += item.increment;
        logMessage = `RAM memory array expanded by +${item.increment}KB. Total: ${state.hardware.ramKB}KB.`;
      } else if (item.targetPillar === 'cpuMHz') {
        state.hardware.cpuMHz = Math.round((state.hardware.cpuMHz + item.increment) * 100) / 100;
        logMessage = `CPU bus clock accelerated by +${item.increment} MHz. Clock: ${state.hardware.cpuMHz.toFixed(2)} MHz.`;
      } else if (item.targetPillar === 'batteryVolts') {
        state.hardware.batteryVolts = Math.round((state.hardware.batteryVolts + item.increment) * 10) / 10;
        updateFloatStatus();
        logMessage = `Power rail increased by +${item.increment}V. 12V bench tap: ${state.hardware.batteryVolts.toFixed(1)}V (${state.hardware.floatStatus}).`;
      }

      if (state.hardware.ramKB >= 96 && !state.secrets.scratchpadUnlocked) {
        state.secrets.scratchpadUnlocked = true;
        logMessage += ' [FEATURE UNLOCKED: FIELD SCRATCHPAD]';
      }
      if (state.hardware.batteryVolts >= 12.6 && state.hardware.floatStatus !== 'BROWNOUT_WARNING') {
        logMessage += ' [CARRIER BENCHMARK STABILIZED // 433.92 MHz FULL BAND]';
      }

      // Remove consumed virtual part
      state.inventory.splice(itemIndex, 1);
      updateFloatStatus();
      persistLocal();

      window.dispatchEvent(new CustomEvent('cipher-hardware-update', { detail: state.hardware }));

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.chime) CipherAudio.chime();
        if (CipherAudio.speak) CipherAudio.speak(`Hardware upgraded. ${logMessage}`);
      }

      this.commitMilestone('FEED_HARDWARE', { itemId: item.id, hardware: state.hardware });

      return {
        success: true,
        message: `> HARDWARE ACCEPTED: ${item.name}\n> ${logMessage}`
      };
    },

    // Diegetic 3-Strike Verification Snark Gate
    registerInputFailure: function () {
      state.meta.failedAttempts = (state.meta.failedAttempts || 0) + 1;
      persistLocal();

      const operatorName = state.cacher.username || 'friend';
      const roleTitle = state.cacher.role === 'BUDDY' ? 'buddy' : 'friend';

      if (state.meta.failedAttempts >= 3) {
        if (typeof CipherAudio !== 'undefined') {
          if (CipherAudio.buzz) CipherAudio.buzz();
          if (CipherAudio.speak) {
            const spokenMsg = state.cacher.role === 'BUDDY'
              ? "Whoa buddy, that code dropped an anvil on the parser!"
              : "Take it slow, friend. That code failed verification on the relay line.";
            CipherAudio.speak(spokenMsg);
          }
        }

        const snarkMsg = state.cacher.role === 'BUDDY'
          ? `> "WHOA NELLY! Look here, buddy: that code triggered an Acme Anvil-Drop Error! Double-check your Rot13 wheel, re-read the field log sheet, or verify your coords before the pinger overheats!"`
          : `> "Easy on the switch bank, friend. That code failed the continuity test. Check your notes from the ammo can log sheet, verify the solder leads, and give it another try."`;

        return {
          snark: true,
          message: snarkMsg
        };
      } else {
        if (typeof CipherAudio !== 'undefined' && CipherAudio.buzz) {
          CipherAudio.buzz();
        }
        return {
          snark: false,
          message: `> "Invalid code entered. Check your log sheet artifact. (Attempt ${state.meta.failedAttempts} of 3)"`
        };
      }
    },

    resetFailureCounter: function () {
      state.meta.failedAttempts = 0;
      persistLocal();
    },

    // Bonus Field Code Validation (Unlocks optional virtual lore/sectors)
    validateFieldCode: function (code) {
      if (!code) return { success: false, reason: 'Empty code payload.' };
      const normalized = code.trim().toUpperCase();

      if (state.campaign.fieldBonusCodes.includes(normalized)) {
        return { success: false, reason: 'Bonus code already redeemed on this terminal.' };
      }

      state.campaign.fieldBonusCodes.push(normalized);
      this.resetFailureCounter();

      // Check for promotion milestone
      if (state.campaign.fieldBonusCodes.length >= 2 && state.cacher.role !== 'BUDDY') {
        this.promoteOperator('BUDDY');
      }

      persistLocal();
      this.commitMilestone('BONUS_CODE_VERIFIED', { code: normalized });

      if (typeof CipherAudio !== 'undefined' && CipherAudio.chime) {
        CipherAudio.chime();
      }

      return {
        success: true,
        code: normalized,
        totalBonusCodes: state.campaign.fieldBonusCodes.length,
        role: state.cacher.role
      };
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
        role: state.cacher.role,
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
        console.warn('[C.I.P.H.E.R. Core] Milestone queued locally.', err);
      });
    }
  };
})();

// Attach to window object for global module accessibility
window.CipherCore = CipherCore;

// Enforce preferences and bootstrap routing on load
document.addEventListener('DOMContentLoaded', () => {
  CipherCore.applyUserPreferences();
  CipherCore.enforceBootstrapGate();
});
