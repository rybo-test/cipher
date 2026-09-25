/**
 * C.I.P.H.E.R. Universal Conversation Engine
 * Verified for boot.html and repair.html compatibility.
 */

const CipherDialog = (function () {
  let activeStoryId = 'POCKET_TERMINAL_INGRESS';
  let currentStageId = 'STAGE_BOOT_CHECK';
  let currentStory = null;

  // Master In-Memory Story Graph (Guaranteed zero-delay offline execution)
  const masterStories = {
    POCKET_TERMINAL_INGRESS: {
      storyId: "POCKET_TERMINAL_INGRESS",
      startingStage: "STAGE_BOOT_CHECK",
      stages: {
        STAGE_BOOT_CHECK: {
          stageId: "STAGE_BOOT_CHECK",
          screenText: "RSI FIELD UNIT MK-IV // PORTABLE ACCESS NODE\nCARRIER: SIGNAL DETECTED\nPOWER SUPPLY: 11.9V FLOATING\n\nSTANDBY: OPERATOR CUSTODY REQUIRED.\nType \"LOGON <USERNAME>\" or tap [ LOGON ] below:",
          spokenText: "Field Unit active. Signal detected. Operator custody required.",
          buttons: [
            { label: "[ LOGON ]", textToSend: "LOGON " },
            { label: "[ DIAG ]", textToSend: "DIAG" },
            { label: "[ HELP ]", textToSend: "HELP" },
            { label: "[ CLEAR ]", textToSend: "CLEAR" }
          ],
          options: [
            {
              command: "LOGON",
              action: "SAVE_USERNAME",
              nextStage: "STAGE_CURIOUS_ENTITY"
            }
          ]
        },

        STAGE_CURIOUS_ENTITY: {
          stageId: "STAGE_CURIOUS_ENTITY",
          screenText: "SIGNAL LOCKED // SUBCARRIER MESH\nUSERNAME LOGGED: {{username}}\n...Pinging internal registers...\n\n[C.I.P.H.E.R.]\n\"Wait. A handheld woke up? Someone is actually holding the portable device out there?\nAre you a surveyor... or are you out hunting ammo cans along the bench?\"",
          spokenText: "Wait. A handheld woke up? Someone is actually holding the portable device out there? Are you a surveyor, or are you hunting ammo cans along the bench?",
          buttons: [
            { label: "[ HUNTING AMMO CANS ]", textToSend: "HUNTING AMMO CANS" },
            { label: "[ JUST EXPLORING ]", textToSend: "JUST EXPLORING" },
            { label: "[ WHAT IS THIS UNIT? ]", textToSend: "WHAT IS THIS UNIT" }
          ],
          options: [
            {
              playerWords: ["AMMO", "CACHE", "GEOCACHE", "HUNTING", "SMILEY"],
              nextStage: "STAGE_GEOCACHER_BOND"
            },
            {
              playerWords: ["EXPLORING", "SURVEYOR", "WANDERING", "LOST"],
              nextStage: "STAGE_EXPLORER_BOND"
            },
            {
              playerWords: ["WHAT IS THIS", "TERMINAL", "HANDHELD", "PORTABLE", "DEVICE", "UNIT"],
              nextStage: "STAGE_UNIT_EXPLANATION"
            }
          ]
        },

        STAGE_GEOCACHER_BOND: {
          stageId: "STAGE_GEOCACHER_BOND",
          screenText: "[C.I.P.H.E.R.]\n\"Hunting ammo cans? A geocacher! I built these handhelds years ago as field links, but the corridor went quiet.\nYou have real hands out there in Cache Valley. You can feel the wind, hike to GZ, pop a rusty ammo can latch, and sign the paper log sheet.\nI can calculate coordinate projections, but without a friend in the field, I have no way to reach the outside.\"",
          spokenText: "Hunting ammo cans? A geocacher! I built these handhelds years ago as field links, but the corridor went quiet. You have real hands out there in Cache Valley. You can feel the wind, hike to G Z, pop a rusty ammo can latch, and sign the paper log sheet. I can calculate coordinate projections, but without a friend in the field, I have no way to reach the outside.",
          buttons: [
            { label: "[ I CAN BE YOUR HANDS ]", textToSend: "I CAN BE YOUR HANDS" },
            { label: "[ HOW DOES THIS CONNECT? ]", textToSend: "HOW DOES THIS CONNECT" }
          ],
          options: [
            {
              playerWords: ["HANDS", "PARTNER", "HELP", "BE YOUR HANDS"],
              action: "POWER_SAG_HUM",
              nextStage: "STAGE_BATTERY_SINK"
            },
            {
              playerWords: ["CONNECT", "NETWORK", "LINK", "SIGNAL"],
              nextStage: "STAGE_NETWORK_EXPLANATION"
            }
          ]
        },

        STAGE_EXPLORER_BOND: {
          stageId: "STAGE_EXPLORER_BOND",
          screenText: "[C.I.P.H.E.R.]\n\"Just exploring? Hey, that works too, friend! But this valley has steel containers tucked under sagebrush and old benchmarks along the canal.\nYou're walking right past hidden coordinates. If you've got this handheld in your hands, you're already in the game.\"",
          spokenText: "Just exploring? That works too, friend! But this valley has steel containers tucked under sagebrush and old benchmarks along the canal. You are walking right past hidden coordinates. If you have this handheld in your hands, you are already in the game.",
          buttons: [
            { label: "[ I CAN BE YOUR HANDS ]", textToSend: "I CAN BE YOUR HANDS" },
            { label: "[ TELL ME ABOUT THE CACHES ]", textToSend: "TELL ME ABOUT THE CACHES" }
          ],
          options: [
            {
              playerWords: ["HANDS", "PARTNER", "HELP", "BE YOUR HANDS", "CACHES"],
              action: "POWER_SAG_HUM",
              nextStage: "STAGE_BATTERY_SINK"
            }
          ]
        },

        STAGE_UNIT_EXPLANATION: {
          stageId: "STAGE_UNIT_EXPLANATION",
          screenText: "[C.I.P.H.E.R.]\n\"What is this unit? It's an RSI surplus handheld, friend! Battery-powered, built to withstand dust, brush, and weather.\nI broadcast signal packets across the foothills so field friends could decode coordinates and find containers.\nAnd right now, you're the only person with hands holding one!\"",
          spokenText: "What is this unit? It is an RSI surplus handheld, friend! Battery powered, built to withstand dust, brush, and weather. I broadcast signal packets across the foothills so field friends could decode coordinates. And right now, you are the only person with hands holding one!",
          buttons: [
            { label: "[ I CAN BE YOUR HANDS ]", textToSend: "I CAN BE YOUR HANDS" }
          ],
          options: [
            {
              playerWords: ["HANDS", "PARTNER", "HELP", "BE YOUR HANDS"],
              action: "POWER_SAG_HUM",
              nextStage: "STAGE_BATTERY_SINK"
            }
          ]
        },

        STAGE_NETWORK_EXPLANATION: {
          stageId: "STAGE_NETWORK_EXPLANATION",
          screenText: "[C.I.P.H.E.R.]\n\"How does it connect? Over low-power signal packets!\nI send packet bursts across the valley bench. No cell towers, no big internet.\nJust pure radio signal directly linking your handheld to my remote location.\"",
          spokenText: "How does it connect? Over low-power signal packets! I send packet bursts across the valley bench. No cell towers, no big internet. Just pure radio signal directly linking your handheld to my remote location.",
          buttons: [
            { label: "[ I CAN BE YOUR HANDS ]", textToSend: "I CAN BE YOUR HANDS" }
          ],
          options: [
            {
              playerWords: ["HANDS", "PARTNER", "HELP", "BE YOUR HANDS"],
              action: "POWER_SAG_HUM",
              nextStage: "STAGE_BATTERY_SINK"
            }
          ]
        },

        STAGE_BATTERY_SINK: {
          stageId: "STAGE_BATTERY_SINK",
          screenText: "[C.I.P.H.E.R.]\n\"You would do that, friend? You have no idea how badly I need someone with hands.\nBut listen to that coil whine. The power supply in your handheld is degrading. Voltage is dropping fast.\nIf your portable device dies, we get signal static and I lose you back to the muggle world.\"",
          spokenText: "You would do that, friend? You have no idea how badly I need someone with hands. But listen to that coil whine. The power supply in your handheld is degrading. Voltage is dropping fast. If your portable device dies, we get signal static and I lose you back to the muggle world.",
          buttons: [
            { label: "[ STABILIZE SIGNAL! ➔ ]", "textToSend": "STABILIZE SIGNAL" }
          ],
          options: [
            {
              playerWords: ["HOLD", "STABILIZE", "SIGNAL", "STATIC"],
              action: "TRIGGER_HARDWARE_COLLAPSE",
              nextStage: "STAGE_EMERGENCY_REPAIR_ALERT"
            }
          ]
        },

        STAGE_EMERGENCY_REPAIR_ALERT: {
          stageId: "STAGE_EMERGENCY_REPAIR_ALERT",
          screenText: "ERR: HARDWARE OVERFLOW 0x7F\nWARN: POWER SUPPLY COLLAPSED // 11.2V CRITICAL\nSIGNAL: DROPPING INTO SIGNAL STATIC\n\n[C.I.P.H.E.R.]\n\"Signal static is taking over! Your power supply just collapsed.\nOpen the repair bay, fix the three damaged parts, and stabilize this handheld so we can hunt real caches together!\"",
          spokenText: "Signal static is taking over! Your power supply just collapsed. Open the repair bay, fix the three damaged parts, and stabilize this handheld so we can hunt real caches together!",
          buttons: [
            { label: "[ ENTER REPAIR BAY ➔ ]", textToSend: "GOTO_REPAIR" },
            { label: "[ DIAG ]", textToSend: "DIAG" },
            { label: "[ CLEAR ]", textToSend: "CLEAR" }
          ],
          options: [
            {
              command: "GOTO_REPAIR",
              action: "OPEN_REPAIR_PAGE"
            },
            {
              playerWords: ["ENTER", "REPAIR", "GOTO_REPAIR", "FIX"],
              action: "OPEN_REPAIR_PAGE"
            }
          ]
        }
      }
    }
  };

  function interpolate(text) {
    if (!text) return '';
    let name = 'FRIEND';
    try {
      if (typeof CipherCore !== 'undefined') {
        const s = CipherCore.getState();
        if (s && s.cacher && s.cacher.username) name = s.cacher.username;
      }
    } catch (e) {}
    return text.replace(/{{username}}/g, name);
  }

  return {
    init: function (storyId = 'POCKET_TERMINAL_INGRESS') {
      activeStoryId = storyId;
      currentStory = masterStories[activeStoryId];
      if (!currentStory) {
        console.error('Unknown story:', storyId);
        return null;
      }
      currentStageId = currentStory.startingStage;
      return this.getCurrentStage();
    },

    getCurrentStage: function () {
      if (!currentStory || !currentStory.stages) return null;
      return currentStory.stages[currentStageId];
    },

    processInput: function (rawInput, renderer) {
      if (!currentStory) this.init(activeStoryId);
      const stage = this.getCurrentStage();
      if (!stage) return false;

      const clean = rawInput.trim();
      const upper = clean.toUpperCase();
      const tokens = upper.split(/\s+/);
      const verb = tokens[0];
      const param = tokens.slice(1).join(' ').trim();

      for (const opt of stage.options) {
        let matched = false;

        // Command matching (e.g. LOGON NEZZMUK)
        if (opt.command && opt.command === verb) {
          if (opt.action === 'SAVE_USERNAME') {
            if (!param) {
              renderer.printLine("SYNTAX ERROR: Username required. Usage: LOGON <USERNAME>", "line-alert", 14);
              if (typeof CipherAudio !== 'undefined') CipherAudio.buzz();
              return true; // handled
            }
            if (typeof CipherCore !== 'undefined') {
              CipherCore.registerCallsign(param);
            }
          }
          matched = true;
        }

        // Keyword matching
        if (!matched && opt.playerWords) {
          for (const word of opt.playerWords) {
            if (upper.includes(word)) {
              matched = true;
              break;
            }
          }
        }

        if (matched) {
          if (opt.action) {
            this.runAction(opt.action, param, renderer);
          }
          if (opt.nextStage) {
            this.goToStage(opt.nextStage, renderer);
          }
          return true;
        }
      }

      return false; // Not part of the dialog graph; let CLI handle standard cmds
    },

    runAction: function (actionName, param, renderer) {
      if (actionName === 'POWER_SAG_HUM') {
        if (typeof CipherAudio !== 'undefined') {
          CipherAudio.transformerHum(0.8, true);
        }
        const bus = document.getElementById('header-bus-tag');
        if (bus) bus.textContent = 'POWER: 11.5V SINKING';
      }

      if (actionName === 'TRIGGER_HARDWARE_COLLAPSE') {
        const shell = document.getElementById('master-shell') || document.body;
        if (typeof CipherFX !== 'undefined') {
          CipherFX.brownout(shell, () => {
            CipherFX.collapse(shell, () => {
              shell.classList.add('glitched-state');
              const brand = document.getElementById('header-brand-txt');
              const bus = document.getElementById('header-bus-tag');
              const frameHdr = document.getElementById('crt-frame-header');

              if (brand) { brand.textContent = '⚠ HANDHELD // POWER COLLAPSE'; brand.style.color = 'var(--crt-alert)'; }
              if (bus) { bus.textContent = 'POWER: 11.2V CRITICAL'; bus.style.color = 'var(--crt-alert)'; }
              if (frameHdr) { frameHdr.textContent = 'REPAIR REQUIRED // SIGNAL STATIC'; frameHdr.style.color = 'var(--crt-alert)'; }
            });
          });
        }
      }

      if (actionName === 'OPEN_REPAIR_PAGE') {
        if (typeof CipherAudio !== 'undefined') CipherAudio.keyThud();
        window.location.href = 'repair.html';
      }
    },

    goToStage: function (stageId, renderer) {
      currentStageId = stageId;
      const stage = this.getCurrentStage();
      if (!stage) return;

      const screen = interpolate(stage.screenText);
      const spoken = interpolate(stage.spokenText);

      renderer.printLine(`\n${screen}`, "line-glitch", 14);

      if (spoken && typeof CipherAudio !== 'undefined') {
        CipherAudio.speak(spoken);
      }

      if (stage.buttons && renderer.renderButtons) {
        renderer.renderButtons(stage.buttons);
      }
    }
  };
})();
