/**
 * C.I.P.H.E.R. Cartography Engine (v5.0)
 * Module 01: Cache Tales Architecture
 * 
 * Accessible sector rendering with full keyboard focus, ARIA tags,
 * authentic trail transit modes, and live radio carrier chatter.
 * Strictly adheres to Master Canon Section 2, Section 4, & Section 5.1.
 */

const CipherMap = (function () {
  const sectorData = {
    SECTOR_01: {
      name: "Sector 01: Cache Valley Bench",
      unlocked: true,
      svgPaths: [
        { d: "M 60 480 L 140 390 L 180 290 L 260 210 L 340 140 L 410 70", class: "map-vector-hwy", title: "US-89/91 Highway Corridor" },
        { d: "M 140 390 L 220 370 L 290 320 L 330 260", class: "map-vector-road", title: "Valley Trunk Road" },
        { d: "M 180 290 L 110 240 L 90 180 L 130 110", class: "map-vector-road", title: "West Bench Byway" },
        { d: "M 480 160 Q 360 210 290 270 T 160 360 T 40 450", class: "map-vector-water", title: "Logan River Run" },
        { d: "M 30 500 L 70 360 L 110 270 L 150 160 L 210 50", class: "map-vector-topo", title: "Wellsville Ridge Contour" },
        { d: "M 40 500 L 85 370 L 125 280 L 165 170 L 225 60", class: "map-vector-topo-subtle", title: "Wellsville Secondary Bench Contour" }
      ],
      towns: [
        { name: "WELLSVILLE", x: 135, y: 412 },
        { name: "LOGAN", x: 265, y: 195 },
        { name: "SMITHFIELD", x: 345, y: 125 }
      ],
      locations: [
        {
          id: "LOC_01_TURNAROUND",
          gcCode: "GC10001",
          name: "Cache Tales #01: The Welded Anchor",
          type: "Ammo Can",
          x: 140,
          y: 390,
          terrain: "Gravel turnout off US-89/91. Level ground along limestone bench.",
          coords: "N 41° 39.120 W 111° 55.450",
          difficulty: "D2.0 / T1.5",
          stageIndex: 0,
          unlocked: true,
          secret: false,
          travelModes: [
            { mode: "drive", label: "Drive Truck", time: "1 min", desc: "Park at wide gravel turnout off highway" },
            { mode: "ride", label: "Ride Bike", time: "4 min", desc: "Paved shoulder route along bench" },
            { mode: "hike", label: "Hike / Walk", time: "12 min", desc: "Short walk from turnout to limestone shelf" }
          ],
          chatter: [
            { call: "NEZZ", text: "30-cal ammo can is bolted solid under the limestone ledge. Don't forget your pen for the log sheet." },
            { call: "CHED", text: "BigJ welded that bracket on the garage jig. Bring trade swag if you swap." }
          ]
        },
        {
          id: "LOC_02_SIPHON",
          gcCode: "GC10008",
          name: "Cache Tales #02: The Canal Siphon",
          type: "Lockbox",
          x: 220,
          y: 370,
          terrain: "Irrigation canal service road. Muddy gravel shoulder near headgate.",
          coords: "N 41° 41.340 W 111° 52.880",
          difficulty: "D2.5 / T2.0",
          stageIndex: 1,
          unlocked: true,
          secret: false,
          travelModes: [
            { mode: "drive", label: "Drive Truck", time: "6 min", desc: "Dirt canal easement road" },
            { mode: "ride", label: "Ride Bike", time: "11 min", desc: "Double-track dirt canal lane" },
            { mode: "hike", label: "Hike / Walk", time: "28 min", desc: "Walk along headgate bank" }
          ],
          chatter: [
            { call: "WAFF", text: "Watch for muggles near the headgate. Cheda dropped his flashlight in the eddy." },
            { call: "MISF", text: "Look low behind the concrete abutment, not inside the siphon tube. BYOP!" }
          ]
        },
        {
          id: "LOC_03_GRAVEL_PIT",
          gcCode: "GC10017",
          name: "Cache Tales #03: Strata & Static",
          type: "Bison Tube",
          x: 290,
          y: 320,
          terrain: "Rocky gravel bench. Steep scree slope with loose limestone shale.",
          coords: "N 41° 43.850 W 111° 49.120",
          difficulty: "D3.0 / T3.5",
          stageIndex: 2,
          unlocked: false,
          secret: false,
          travelModes: [
            { mode: "drive", label: "Drive Truck", time: "14 min", desc: "Base of gravel pit haul road" },
            { mode: "hike", label: "Hike Trail", time: "35 min", desc: "Steep scree scramble to high bench" }
          ],
          chatter: [
            { call: "CHED", text: "Scree is loose on the climb. Wear your boots with solid ankle support." },
            { call: "NEZZ", text: "RSI 433.92 MHz benchmark line is pinging clear off this ridge. Keep your ears open." }
          ]
        },
        {
          id: "LOC_SECRET_RAT_LAIR",
          gcCode: "GC-SECRET",
          name: "The Rat Lair (Franken-Rig Bench)",
          type: "Rig Terminal",
          x: 95,
          y: 220,
          terrain: "Concealed scrub oak drainage. Unmarked bench approach.",
          coords: "REMOTE GATEWAY // STATIONARY HARDWARE",
          difficulty: "D5.0 / T4.0",
          stageIndex: 99,
          unlocked: false,
          secret: true,
          travelModes: [
            { mode: "hike", label: "Hike Trail", time: "18 min", desc: "Scrub oak drainage scramble" }
          ],
          chatter: [
            { call: "NEZZ", text: "Rig is humming on the 12V bench tap. Watch your boots around the Acme wiring." },
            { call: "MISF", text: "Relay 70 is hot! Keep the garage blast doors latched and don't trip the pinger." }
          ]
        }
      ]
    },
    SECTOR_02: {
      name: "Sector 02: Box Elder / Tremonton",
      unlocked: false,
      reason: "LOCKED: Complete Stage 2 or decode RSI benchmark carrier line."
    },
    SECTOR_03: {
      name: "Sector 03: Bear Lake & High Pass",
      unlocked: false,
      reason: "LOCKED: Requires High-Gain Calibration Tag [PART] from previous stage."
    },
    SECTOR_04: {
      name: "Sector 04: SE Idaho & Island Park",
      unlocked: false,
      reason: "LOCKED: Northern regional corridor locked pending capstone find."
    }
  };

  let activeSectorKey = 'SECTOR_01';
  let selectedLocation = null;

  return {
    init: function () {
      this.bindControls();
      this.renderSector(activeSectorKey);
      this.initCommsTicker();
    },

    bindControls: function () {
      const themeToggle = document.getElementById('btn-theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const state = typeof CipherCore !== 'undefined' ? CipherCore.getState() : null;
          const currentTheme = state && state.meta && state.meta.theme ? state.meta.theme : 'rsi';
          const nextTheme = currentTheme === 'rsi' ? 'blueprint' : 'rsi';

          if (typeof CipherCore !== 'undefined') {
            CipherCore.setTheme(nextTheme);
          }

          themeToggle.textContent = nextTheme === 'rsi' ? '[ CRT PHOSPHOR ]' : '[ TOPO BLUEPRINT ]';
          if (typeof CipherAudio !== 'undefined' && CipherAudio.click) {
            CipherAudio.click();
          }
          this.renderSector(activeSectorKey);
        });
      }

      const sectorSelect = document.getElementById('sector-select');
      if (sectorSelect) {
        sectorSelect.addEventListener('change', (e) => {
          activeSectorKey = e.target.value;
          if (typeof CipherAudio !== 'undefined' && CipherAudio.click) {
            CipherAudio.click();
          }
          this.renderSector(activeSectorKey);
        });
      }

      const closeDrawerBtn = document.getElementById('btn-close-drawer');
      if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
          this.closeDrawer();
          if (typeof CipherAudio !== 'undefined' && CipherAudio.click) {
            CipherAudio.click();
          }
        });
      }
    },

    renderSector: function (sectorKey) {
      const canvas = document.getElementById('map-svg-canvas');
      const shroud = document.getElementById('map-shroud-overlay');
      const sec = sectorData[sectorKey];

      if (!canvas) return;

      if (!sec.unlocked) {
        canvas.innerHTML = '';
        if (shroud) {
          shroud.style.display = 'flex';
          shroud.innerHTML = `
            <div class="shroud-card" role="alert">
              <div class="shroud-alert">⚠ CARRIER LINK INACTIVE ⚠</div>
              <div class="shroud-title">${sec.name}</div>
              <div class="shroud-desc">${sec.reason}</div>
            </div>
          `;
        }
        return;
      }

      if (shroud) {
        shroud.style.display = 'none';
      }

      let pathsSvg = sec.svgPaths.map(p => {
        return `<path d="${p.d}" class="${p.class}" aria-label="${p.title || ''}" />`;
      }).join('');

      let townsSvg = sec.towns.map(t => {
        return `
          <g class="map-town-group" transform="translate(${t.x}, ${t.y})" aria-hidden="true">
            <circle r="4" class="map-town-dot" />
            <text x="8" y="5" class="map-town-label">${t.name}</text>
          </g>
        `;
      }).join('');

      const state = typeof CipherCore !== 'undefined' ? CipherCore.getState() : null;
      const ratLairKnown = state && state.secrets && state.secrets.ratLairDiscovered;

      let locationsSvg = sec.locations.map(loc => {
        if (loc.secret && !ratLairKnown) return '';

        const isCurrent = state && state.campaign && state.campaign.currentLocationId === loc.id;
        const isSecret = loc.secret;
        const pinClass = isSecret ? 'pin-secret' : (loc.unlocked ? (isCurrent ? 'pin-current' : 'pin-active') : 'pin-locked');

        return `
          <g 
            class="map-location-pin ${pinClass}" 
            transform="translate(${loc.x}, ${loc.y})"
            role="button"
            tabindex="0"
            aria-label="${loc.name}, Container: ${loc.type}, Rating: ${loc.difficulty}"
            onclick="CipherMap.selectLocation('${loc.id}')"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();CipherMap.selectLocation('${loc.id}');}"
          >
            <circle r="${isSecret ? 11 : 9}" class="pin-ring" aria-hidden="true" />
            <circle r="4" class="pin-core" aria-hidden="true" />
            ${isCurrent ? '<circle r="16" class="pin-pulse" aria-hidden="true" />' : ''}
            <text x="14" y="5" class="pin-label" aria-hidden="true">${loc.type.toUpperCase()}</text>
          </g>
        `;
      }).join('');

      canvas.innerHTML = `
        <title>${sec.name} Field Map</title>
        <desc>Topographical map showing highways, elevation contours, Cache Valley towns, and geocache Ground Zero coordinates.</desc>
        ${pathsSvg}
        ${townsSvg}
        ${locationsSvg}
      `;
    },

    selectLocation: function (locId) {
      const sec = sectorData[activeSectorKey];
      if (!sec || !sec.locations) return;

      const loc = sec.locations.find(l => l.id === locId);
      if (!loc) return;

      selectedLocation = loc;
      if (typeof CipherAudio !== 'undefined' && CipherAudio.click) {
        CipherAudio.click();
      }

      const poiName = document.getElementById('poi-name');
      const poiType = document.getElementById('poi-type');
      const poiCoords = document.getElementById('poi-coords');
      const poiTerrain = document.getElementById('poi-terrain');

      if (poiName) poiName.textContent = loc.name;
      if (poiType) poiType.textContent = `${loc.type} // ${loc.difficulty}`;
      if (poiCoords) poiCoords.textContent = loc.coords;
      if (poiTerrain) poiTerrain.textContent = loc.terrain;

      if (loc.chatter && loc.chatter.length > 0) {
        const line = loc.chatter[Math.floor(Math.random() * loc.chatter.length)];
        this.pushCommsChatter(line.call, line.text);
      }

      const drawer = document.getElementById('poi-drawer');
      if (drawer) {
        drawer.classList.add('open');
        const crackBtn = drawer.querySelector('button.primary');
        if (crackBtn) crackBtn.focus();
      }
    },

    closeDrawer: function () {
      const drawer = document.getElementById('poi-drawer');
      if (drawer) drawer.classList.remove('open');
      selectedLocation = null;
    },

    openTravelModal: function () {
      if (!selectedLocation) return;
      if (typeof CipherAudio !== 'undefined' && CipherAudio.click) {
        CipherAudio.click();
      }

      const modal = document.getElementById('travel-modal');
      const list = document.getElementById('travel-options-list');
      if (!modal || !list) return;

      list.innerHTML = selectedLocation.travelModes.map(m => {
        let icon = m.mode === 'drive' ? '🚗' : (m.mode === 'ride' ? '🚲' : (m.mode === 'paddle' ? '🛶' : '🥾'));
        return `
          <button class="btn-cipher travel-option-btn" onclick="CipherMap.executeTravel('${m.mode}', '${m.label}')">
            <span class="travel-icon" aria-hidden="true">${icon}</span>
            <div class="travel-meta">
              <div class="travel-title">${m.label} (${m.time})</div>
              <div class="travel-desc">${m.desc}</div>
            </div>
          </button>
        `;
      }).join('');

      modal.style.display = 'flex';
      const firstOpt = list.querySelector('button');
      if (firstOpt) firstOpt.focus();
    },

    closeTravelModal: function () {
      const modal = document.getElementById('travel-modal');
      if (modal) modal.style.display = 'none';
      if (typeof CipherAudio !== 'undefined' && CipherAudio.click) {
        CipherAudio.click();
      }
    },

    executeTravel: function (mode, label) {
      if (!selectedLocation) return;

      this.closeTravelModal();

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.micClick) CipherAudio.micClick();
        if (CipherAudio.speak) {
          if (mode === 'drive') {
            CipherAudio.speak(`En route to ${selectedLocation.type}. Highway transit engaged.`);
          } else {
            CipherAudio.speak(`Arrived at location. Approach Ground Zero on foot.`);
          }
        }
      }

      if (typeof CipherCore !== 'undefined') {
        const state = CipherCore.getState();
        state.campaign.currentLocationId = selectedLocation.id;
        CipherCore.commitMilestone('TRAVEL_MOVE', { locationId: selectedLocation.id, mode: mode });
      }

      this.pushCommsChatter("NEZZ", `Arrived at ${selectedLocation.name}. Radios on low.`);
      this.renderSector(activeSectorKey);
      this.closeDrawer();
    },

    pushCommsChatter: function (callsign, message) {
      const ticker = document.getElementById('comms-ticker');
      const meterSegs = document.querySelectorAll('.s-meter-seg');

      if (typeof CipherAudio !== 'undefined' && CipherAudio.squelchTail) {
        CipherAudio.squelchTail();
      }

      meterSegs.forEach((seg, i) => {
        if (i < 4) seg.classList.add('lit');
        if (i === 4) seg.classList.add('peak');
      });

      if (ticker) {
        ticker.textContent = `[${callsign}] "${message}"`;
      }

      setTimeout(() => {
        meterSegs.forEach(seg => {
          seg.classList.remove('lit');
          seg.classList.remove('peak');
        });
      }, 1500);
    },

    initCommsTicker: function () {
      const defaultLines = [
        { call: "MISF", text: "Monitoring 433.920 MHz. All bench repeaters clear." },
        { call: "WAFF", text: "Checking for FTF notifications. Cheda has the ladder in the truck." },
        { call: "CHED", text: "No DNFs today. Check your battery voltage on the bench tap." }
      ];
      const line = defaultLines[Math.floor(Math.random() * defaultLines.length)];
      this.pushCommsChatter(line.call, line.text);
    },

    discoverRatLair: function () {
      if (typeof CipherCore !== 'undefined') {
        const state = CipherCore.getState();
        state.secrets.ratLairDiscovered = true;
        CipherCore.commitMilestone('DISCOVER_RAT_LAIR', { timestamp: new Date().toISOString() });
      }

      if (typeof CipherAudio !== 'undefined') {
        if (CipherAudio.chime) CipherAudio.chime();
        if (CipherAudio.speak) {
          CipherAudio.speak("Stationary rig gateway verified. Rat Pack lair plotted on map.");
        }
      }

      this.pushCommsChatter("NEZZ", "GATEWAY PING DETECTED! Who opened the remote link to the lair?");
      this.renderSector('SECTOR_01');
    }
  };
})();

// Attach to window object for global module accessibility
window.CipherMap = CipherMap;
