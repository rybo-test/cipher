/**
 * C.I.P.H.E.R. Core Architecture & Game State Engine (v4.3)
 * Implements the 3-Slot Inventory Constraint, Independent Triforce Hardware Bus,
 * Secret CLI Command Parser, and Dynamic Cloud Cache Ledger Integration.
 */

const CipherCore = (function () {
  const STORAGE_KEY = 'CIPHER_STATE_V43';
  const CLOUD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzrzQ2MAKNRt79dW478pfcX0A0n3InlojyfEPIZoTkq9c34N74z5hkwheYMz4MCRz60/exec';

  const defaultState = {
    bootstrapped: false,
    cacher: {
      username: 'MUGGLE_BEAN',
      syncKey: 'CT-INIT-0000',
      totalFinds: 0,
      isCertifiedOperative: false
    },
    // The Triforce Triad Architecture
    hardware: {
      cpuMHz: 1.77,           // Baseline MOS 6502 (Top/Right Vertex)
      ramKB: 64,              // Baseline 64KB (Bottom/Left Vertex)
      batteryVolts: 11.8,     // Baseline Brownout (Bottom/Right Vertex)
      floatStatus: 'BROWNOUT_WARNING' // BROWNOUT_WARNING | STABILIZED | FLOAT_OK | SOLAR_FLOAT
    },
    // 3-Slot Hard Limit Starter Pack
    pack: {
      maxSlots: 3,
      items: []
    },
    campaign: {
      currentSector: 'SECTOR_01',
      mapUnlocked: false,
      activeMissionId: 'MISSION_01_IGNITION',
      completedMissions: [],
      claimedTokens: [],
      revealedCaches: ['GC10001']
    },
    triage: {
      diagCircuitDone: false,
      diagMemoryDone: false,
      diagSensorDone: false,
      gateCracked: false
    },
    meta: {
      failedAttempts: 0,
      theme: 'crt',
      fontSize: 'large'
    }
  };

  // Local Offline Cache Ledger Fallback
  const localCacheLedger = {
    'GC10001': {
      gcCode: 'GC10001',
      cacheName: 'The Calibrated Anchor',
      sectorId: 'SECTOR_01',
      latitude: 'N 41° 39.120',
      longitude: 'W 111° 55.450',
      difficulty: 2.0,
      terrain: 1.5,
      size: 'Regular',
      containerType: 'Ammo Can',
      certitudeWord: 'ANCHOR-RELAY-1984',
      certitudeUrl: 'https://www.geocaching.com/geocache/GC10001',
      hintText: 'Tethered to rusted headgate frame along the ditch line.',
      lidVoucherCode: 'GC1-LID-ANCHOR',
      voucherRewardId: 'PART_RAM_16KB',
      isActive: true
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
      console.warn('CipherCore: Local storage unavailable, using defaults.');
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function persistLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('CipherCore: Failed to save state locally.', e);
    }
  }

  function updateFloatStatus() {
    const v = state.hardware.batteryVolts;
    if (v < 12.0) state.hardware.floatStatus = 'BROWNOUT_WARNING';
    else if (v < 12.5) state.hardware.floatStatus = 'STABILIZED';
    else if (v < 13.2) state.hardware.floatStatus = 'FLOAT_OK';
    else state.hardware.floatStatus = 'SOLAR_FLOAT';
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

    enforceBootstrapGate: function () {
      const p = window.location.pathname;
      const isBootPage = p.endsWith('boot.html') || p.endsWith('/') || p === '';
      if (!state.bootstrapped && !isBootPage) {
        window.location.replace('boot.html');
      }
    },

    // First-Run Identification (Transition from Muggle to Cacher)
    registerCallsign: function (username) {
      state.cacher.username = username.trim().toUpperCase();
      const cleanTag = state.cacher.username.replace(/[^A-Z0-9]/g, '').substring(0, 4).padEnd(4, 'X');
      const suffix = Math.floor(1000 + Math.random() * 9000);
      state.cacher.syncKey = `CT-${cleanTag}-${suffix}`;
      persistLocal();
      return state.cacher;
    },

    // Secret CLI Bypass & Command Parsing
    parseCliCommand: function (cmdInput) {
      const tokens = cmdInput.trim().toUpperCase().split(/\s+/);
      const action = tokens[0];
      const param = tokens[1];

      if (action === 'HELP') {
        return {
          success: true,
          output: 'AVAILABLE COMMANDS:\n- LOGON [CALLSIGN] : Initiate terminal custody\n- BYPASS [SYNCKEY] : Restore existing operative session\n- DIAG            : Run cold POST diagnostic\n- CLEAR           : Clear terminal screen'
        };
      }

      if (action === 'DIAG') {
        return {
          success: true,
          output: `CHASSIS: RSI MK-IV SURPLUS [1984]\nCPU BUS: ${state.hardware.cpuMHz.toFixed(2)} MHz\nRAM MEM: ${state.hardware.ramKB} KB\nVOLTAGE: ${state.hardware.batteryVolts.toFixed(1)}V (${state.hardware.floatStatus})\nPACK   : ${state.pack.items.length}/${state.pack.maxSlots} SLOTS OCCUPIED`
        };
      }

      if (action === 'BYPASS' || action === 'RESTORE') {
        if (!param) return { success: false, output: 'ERROR: Passkey required. Usage: BYPASS CT-XXXX-0000' };
        
        // Fast-track bypass
        state.bootstrapped = true;
        state.cacher.syncKey = param;
        state.cacher.username = param.split('-')[1] || 'VETERAN_CACHER';
        state.cacher.isCertifiedOperative = true;
        state.triage.diagCircuitDone = true;
        state.triage.diagMemoryDone = true;
        state.triage.diagSensorDone = true;
        state.triage.gateCracked = true;
        state.campaign.mapUnlocked = true;
        state.hardware.batteryVolts = 12.6;
        state.hardware.ramKB = 128;
        state.hardware.cpuMHz = 3.58;
        updateFloatStatus();
        persistLocal();

        return {
          success: true,
          bypass: true,
          output: `BYPASS VALIDATED // OPERATIVE ${state.cacher.username} RESTORED. ROUTING TO MISSION...`
        };
      }

      return { success: false, output: `UNKNOWN COMMAND: "${action}". TYPE "HELP" OR TAP [ LOGON ].` };
    },

    // 3-Slot Inventory Management & Overflow Protection
    addItemToPack: function (itemObj) {
      if (state.pack.items.length >= state.pack.maxSlots) {
        return {
          success: false,
          reason: `PACK CAPACITY EXCEEDED! Pack has only ${state.pack.maxSlots} slots, Human Bean. Feed a part into the bus or make space first.`
        };
      }

      state.pack.items.push(itemObj);
      persistLocal();
      this.commitMilestone('ITEM_ACQUIRED', { itemId: itemObj.id });
      return { success: true, item: itemObj };
    },

    removeItemFromPack: function (itemId) {
      const idx = state.pack.items.findIndex(i => i.id === itemId);
      if (idx === -1) return false;
      const removed = state.pack.items.splice(idx, 1)[0];
      persistLocal();
      return removed;
    },

    // Independent Triforce Hardware Feeding Engine
    feedItemToBus: function (itemId) {
      const idx = state.pack.items.findIndex(i => i.id === itemId);
      if (idx === -1) return { success: false, reason: 'Item not located in pack slots.' };

      const item = state.pack.items[idx];
      if (item.type !== 'PART' || !item.targetPillar) {
        return { success: false, reason: 'Terminal rejects item. Only [PART] hardware can be fed to C.I.P.H.E.R.' };
      }

      let logMsg = '';
      if (item.targetPillar === 'batteryVolts') {
        state.hardware.batteryVolts = Math.round((state.hardware.batteryVolts + item.increment) * 10) / 10;
        updateFloatStatus();
        logMsg = `Power bus increased +${item.increment}V. Float status: ${state.hardware.batteryVolts.toFixed(1)}V (${state.hardware.floatStatus}).`;
      } else if (item.targetPillar === 'ramKB') {
        state.hardware.ramKB += item.increment;
        logMsg = `RAM memory expanded +${item.increment}KB. Array total: ${state.hardware.ramKB}KB.`;
      } else if (item.targetPillar === 'cpuMHz') {
        state.hardware.cpuMHz = Math.round((state.hardware.cpuMHz + item.increment) * 100) / 100;
        logMsg = `CPU clock accelerated +${item.increment}MHz. Speed: ${state.hardware.cpuMHz.toFixed(2)}MHz.`;
      }

      // Remove from pack slot
      state.pack.items.splice(idx, 1);
      persistLocal();

      if (typeof CipherAudio !== 'undefined') {
        CipherAudio.chime();
        CipherAudio.speak(`Hardware absorbed. ${logMsg}`);
      }

      this.commitMilestone('HARDWARE_UPGRADE', { itemId: item.id, hardware: state.hardware });
      return { success: true, message: `> HARDWARE ACCEPTED: ${item.name}\n> ${logMsg}` };
    },

    // Dynamic Cache Ledger Fetcher
    fetchCacheDetails: async function (gcCode) {
      // 1. Check local fallback immediately
      const fallback = localCacheLedger[gcCode];
      
      try {
        const resp = await fetch(`${CLOUD_ENDPOINT}?action=getCache&gcCode=${gcCode}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.gcCode) return data;
        }
      } catch (e) {
        console.warn('CipherCore: Cloud ledger unreachable, using offline fallback.', e);
      }

      return fallback || null;
    },

    // Optional Field Voucher Redemption
    redeemFieldToken: async function (tokenCode) {
      const cleanToken = tokenCode.trim().toUpperCase();

      if (state.campaign.claimedTokens.includes(cleanToken)) {
        return { success: false, reason: 'Token already logged in custody ledger, Human Bean! One harvest per container.' };
      }

      if (state.pack.items.length >= state.pack.maxSlots) {
        return { success: false, reason: 'Pack is full! Make space before claiming more field salvage.' };
      }

      // Check matching container in ledger
      const cache = await this.fetchCacheDetails('GC10001');
      if (cache && cache.lidVoucherCode === cleanToken) {
        state.campaign.claimedTokens.push(cleanToken);
        
        const rewardPart = {
          id: 'PART_RAM_16KB',
          type: 'PART',
          name: '16KB Static Memory DIP',
          desc: 'Aerospace ceramic RAM salvaged from ammo can lid. Feeds +16KB to C.I.P.H.E.R.',
          targetPillar: 'ramKB',
          increment: 16,
          icon: '💾',
          badge: 'Surplus // PART'
        };

        this.addItemToPack(rewardPart);
        persistLocal();

        if (typeof CipherAudio !== 'undefined') {
          CipherAudio.chime();
          CipherAudio.speak("Lid token verified. 16 Kilobyte memory chip secured in pack.");
        }

        return { success: true, message: `TOKEN VERIFIED: [${cleanToken}]\nAcquired: 16KB Static Memory DIP. Added to pack.` };
      }

      if (typeof CipherAudio !== 'undefined') CipherAudio.buzz();
      return { success: false, reason: 'INVALID VOUCHER TOKEN. Check the stamp on the physical container lid.' };
    },

    // 3-Strike "Human Bean" Snark Gate
    registerInputFailure: function () {
      state.meta.failedAttempts = (state.meta.failedAttempts || 0) + 1;
      persistLocal();

      if (state.meta.failedAttempts >= 3) {
        if (typeof CipherAudio !== 'undefined') {
          CipherAudio.buzz();
          CipherAudio.speak("Nice try, Human Bean. That code did not compute.");
        }
        return {
          snark: true,
          message: '> "Nice try, Human Bean. That code didn\'t even come close. Check your Rot13 wheel or review the hint."'
        };
      } else {
        if (typeof CipherAudio !== 'undefined') CipherAudio.buzz();
        return {
          snark: false,
          message: `> "Verification failed. (Attempt ${state.meta.failedAttempts} of 3)"`
        };
      }
    },

    resetFailureCounter: function () {
      state.meta.failedAttempts = 0;
      persistLocal();
    },

    completeTriageCertification: function () {
      state.bootstrapped = true;
      state.cacher.isCertifiedOperative = true;
      persistLocal();
      this.commitMilestone('CERTIFIED_OPERATIVE', { username: state.cacher.username });
    },

    factoryReset: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
      } catch (e) {}
      state = JSON.parse(JSON.stringify(defaultState));
      persistLocal();
      window.location.replace('boot.html');
    },

    commitMilestone: function (actionType, payload) {
      persistLocal();
      const body = {
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
        body: JSON.stringify(body)
      }).catch(e => console.warn('CipherCore: Telemetry queued locally.'));
    },

    applyUserPreferences: applyPreferences
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  CipherCore.applyUserPreferences();
  CipherCore.enforceBootstrapGate();
});
