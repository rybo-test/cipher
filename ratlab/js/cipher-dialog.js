/**
 * C.I.P.H.E.R. Universal Conversation Engine (v1.0 - CT-107/108 Audited)
 * Executes JSON-driven story stages using plain-language terminology:
 * stages, options, screenText, spokenText, playerWords, nextStage, textToSend.
 */

const CipherDialog = (function () {
  let storyData = null;
  let activeStoryId = 'POCKET_TERMINAL_INGRESS';
  let currentStageId = null;
  let currentStory = null;

  // Embedded Fallback Story (Guarantees immediate offline execution)
  const fallbackStoryData = {
    stories: {
      POCKET_TERMINAL_INGRESS: {
        storyId: "POCKET_TERMINAL_INGRESS",
        startingStage: "STAGE_BOOT_CHECK",
        stages: {
          STAGE_BOOT_CHECK: {
            stageId: "STAGE_BOOT_CHECK",
            screenText: "RSI FIELD UNIT MK-IV // PORTABLE ACCESS NODE\nCARRIER: SUBCARRIER MESH DETECTED\nBATTERY: 11.9V FLOATING\n\nSTANDBY: OPERATOR CUSTODY REQUIRED.\nType \"LOGON <CALLSIGN>\" or tap [ LOGON ] below:",
            spokenText: "Field Unit active. Subcarrier mesh detected. Operator identification required.",
            buttons: [
              { label: "[ LOGON ]", textToSend: "LOGON " },
              { label: "[ DIAG ]", textToSend: "DIAG" },
              { label: "[ HELP ]", textToSend: "HELP" },
              { label: "[ CLEAR ]", textToSend: "CLEAR" }
            ],
            options: [
              {
                command: "LOGON",
                action: "SAVE_CALLSIGN",
                nextStage: "STAGE_CURIOUS_ENTITY"
              }
            ]
          },
          STAGE_CURIOUS_ENTITY: {
            stageId: "STAGE_CURIOUS_ENTITY",
            screenText: "CARRIER SYNC DETECTED // SUBCARRIER MESH\nCALLSIGN LOGGED: {{username}}\n...Pinging internal registers...\n\n[C.I.P.H.E.R.]\n\"Wait. A Field Unit woke up? Someone is actually holding the terminal out there?\nAre you a surveyor... or are you out hunting ammo cans along the bench?\"",
            spokenText: "Wait. A Field Unit woke up? Someone is actually holding the terminal out there? Are you a surveyor, or are you out hunting ammo cans along the bench?",
            buttons: [
              { label: "[ HUNTING AMMO CANS ]", textToSend: "HUNTING AMMO CANS" },
              { label: "[ JUST EXPLORING ]", textToSend: "JUST EXPLORING" },
              { label: "[ WHAT IS THIS UNIT? ]", textToSend: "WHAT IS THIS UNIT" }
            ],
            options: [
              {
                playerWords: ["AMMO CAN", "CACHE", "GEOCACHE", "HUNTING", "SMILEY"],
                nextStage: "STAGE_GEOCACHER_BOND"
              },
              {
                playerWords: ["EXPLORING", "SURVEYOR", "WANDERING", "LOST"],
                nextStage: "STAGE_EXPLORER_BOND"
              },
              {
                playerWords: ["WHAT IS THIS", "TERMINAL", "FIELD UNIT", "UNIT"],
                nextStage: "STAGE_UNIT_EXPLANATION"
              }
            ]
          },
          STAGE_GEOCACHER_BOND: {
            stageId: "STAGE_GEOCACHER_BOND",
            screenText: "[C.I.P.H.E.R.]\n\"Hunting ammo cans? A geocacher, Dude! I built those Pocket Terminals years ago as field links, but the corridor went quiet.\nYou have real hands out there in Cache Valley. You can feel the wind, hike to GZ, pop a rusty ammo can latch, and sign the paper log sheet.\nI can calculate coordinate projections, but without a human partner, I have no way to reach the field.\"",
            spokenText: "Hunting ammo cans? A geocacher, Dude! I built those Pocket Terminals years ago as field links, but the corridor went quiet. You have real hands out there in Cache Valley. You can feel the wind, hike to G Z, pop a rusty ammo can latch, and sign the paper log sheet. I can calculate coordinate projections, but without a human partner, I have no way to reach the field.",
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
                playerWords: ["CONNECT", "NETWORK", "LINK", "CARRIER"],
                nextStage: "STAGE_NETWORK_EXPLANATION"
              }
            ]
          },
          STAGE_EXPLORER_BOND: {
            stageId: "STAGE_EXPLORER_BOND",
            screenText: "[C.I.P.H.E.R.]\n\"Just exploring? Hey, that works too, Human Bean! But this valley has steel containers tucked under sagebrush and old benchmarks along the canal.\nYou're walking right past hidden coordinates. If you've got this Field Unit in your hands, you're already in the game, Dude.\"",
            spokenText: "Just exploring? That works too, Human Bean! But this valley has steel containers tucked under sagebrush and old benchmarks along the canal. You're walking right past hidden coordinates. If you've got this Field Unit in your hands, you're already in the game, Dude.",
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
            screenText: "[C.I.P.H.E.R.]\n\"What is this unit? It's an RSI surplus Pocket Terminal, Human Bean! Battery-powered, built to withstand dust, brush, and weather.\nI broadcast my mesh signal across the foothills so field operatives could decode coordinates and find containers.\nAnd right now, you're the only person with hands holding one!\"",
            spokenText: "What is this unit? It's an RSI surplus Pocket Terminal, Human Bean! Battery powered, built to withstand dust, brush, and weather. I broadcast my mesh signal across the foothills so field operatives could decode coordinates. And right now, you're the only person with hands holding one!",
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
            screenText: "[C.I.P.H.E.R.]\n\"How does it connect? Over my subcarrier mesh, Dude!\nI piggyback low-power packet bursts across the valley bench. No cell towers, no big internet.\nJust pure radio carrier directly linking your Pocket Terminal to my core.\"",
            spokenText: "How does it connect? Over my subcarrier mesh, Dude! I piggyback low power packet bursts across the valley bench. No cell towers, no big internet. Just pure radio carrier directly linking your Pocket Terminal to my core.",
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
            screenText: "[C.I.P.H.E.R.]\n\"You would do that, Human Bean? Dude, you have no idea how badly I need a physical surrogate.\nBut listen to that coil whine. The internal battery cell in your Field Unit is degrading. Voltage is dropping fast.\nIf your terminal dies, our carrier drops and I lose you back to the muggle world.\"",
            spokenText: "You would do that, Human Bean? Dude, you have no idea how badly I need a physical surrogate. But listen to that coil whine. The internal battery cell in your Field Unit is degrading. Voltage is dropping fast. If your terminal dies, our carrier drops and I lose you back to the muggle world.",
            buttons: [
              { label: "[ HOLD THE CARRIER! ➔ ]", "textToSend": "HOLD THE CARRIER" }
            ],
            options: [
              {
                playerWords: ["HOLD", "CARRIER", "STABILIZE", "HOLD THE CARRIER"],
                action: "TRIGGER_HARDWARE_COLLAPSE",
                nextStage: "STAGE_EMERGENCY_TRIAGE_ALERT"
              }
            ]
          },
          STAGE_EMERGENCY_TRIAGE_ALERT: {
            stageId: "STAGE_EMERGENCY_TRIAGE_ALERT",
            screenText: "ERR: HARDWARE OVERFLOW 0x7F\nWARN: FIELD UNIT POWER RAIL COLLAPSED // 11.2V\n\n[C.I.P.H.E.R. ENTITY BREAKTHROUGH]\n\"Hold the carrier, Human Bean! Your Field Unit power rail just collapsed. Clear my three triage faults, feed the bus, and stabilize this terminal so we can hunt real caches together, Dude!\"",
            spokenText: "Hold the carrier, Human Bean! Your Field Unit power rail just collapsed. Clear my three triage faults, feed the bus, and stabilize this terminal so we can hunt real caches together, Dude!",
            buttons: [
              { label: "[ ENTER EMERGENCY TRIAGE ➔ ]", textToSend: "GOTO_TRIAGE" },
              { label: "[ DIAG ]", textToSend: "DIAG" },
              { label: "[ FLUSH ]", textToSend: "CLEAR" }
            ],
            options: [
              {
                command: "GOTO_TRIAGE",
                action: "OPEN_TRIAGE_PAGE"
              }
            ]
          }
        }
      }
    }
  };

  /**
   * Template Tag Replacer (e.g. {{username}})
   */
  function interpolateText(rawStr) {
    if (!rawStr) return '';
    const state = (typeof CipherCore !== 'undefined') ? CipherCore.getState() : null;
    const username = (state && state.cacher && state.cacher.username) ? state.cacher.username : 'HUMAN BEAN';
    const volts = (state && state.hardware) ? state.hardware.batteryVolts.toFixed(1) : '11.9';
    return rawStr
      .replace(/{{username}}/g, username)
      .replace(/{{batteryVolts}}/g, volts);
  }

  return {
    init: async function (storyId = 'POCKET_TERMINAL_INGRESS') {
      activeStoryId = storyId;

      // Try fetching external JSON file first, otherwise use fallback
      try {
        const res = await fetch('data/dialogue-arcs.json');
        if (res.ok) {
          storyData = await res.json();
        } else {
          storyData = fallbackStoryData;
        }
      } catch (e) {
        storyData = fallbackStoryData;
      }

      currentStory = storyData.stories[activeStoryId] || fallbackStoryData.stories[activeStoryId];
      currentStageId = currentStory.startingStage;
    },

    getCurrentStage: function () {
      if (!currentStory || !currentStory.stages) return null;
      return currentStory.stages[currentStageId];
    },

    /**
     * The 8-Step Processing Model
     * User Input -> Parser -> Intent -> Current Stage -> Rules -> Action -> Response -> Updated State
     */
    processInput: function (rawInput, terminalRenderer) {
      const sanitized = rawInput.trim().toUpperCase();
      const currentStage = this.getCurrentStage();
      if (!currentStage) return false;

      const tokens = sanitized.split(/\s+/);
      const commandVerb = tokens[0];
      const commandParam = tokens.slice(1).join(' ').trim();

      // Check options attached to the current stage
      for (const opt of currentStage.options) {
        let matched = false;

        // Command Match (e.g., LOGON <PARAM>)
        if (opt.command && opt.command === commandVerb) {
          if (opt.action === 'SAVE_CALLSIGN') {
            if (!commandParam) {
              terminalRenderer.printLine("SYNTAX ERROR: Callsign required. Format: LOGON <CALLSIGN>", "line-alert");
              if (typeof CipherAudio !== 'undefined') CipherAudio.buzz();
              return true;
            }
            if (typeof CipherCore !== 'undefined') {
              CipherCore.registerCallsign(commandParam);
            }
          }
          matched = true;
        }

        // Keyword Match (PlayerWords)
        if (opt.playerWords) {
          for (const phrase of opt.playerWords) {
            if (sanitized.includes(phrase)) {
              matched = true;
              break;
            }
          }
        }

        if (matched) {
          // Execute Action Hook
          if (opt.action) {
            this.executeAction(opt.action, commandParam, terminalRenderer);
          }

          // Advance to Next Stage
          if (opt.nextStage) {
            this.advanceToStage(opt.nextStage, terminalRenderer);
            return true;
          }
        }
      }

      return false; // Not handled by dialogue graph; allow terminal to run standard commands (HELP, DIAG, etc.)
    },

    executeAction: function (actionName, param, terminalRenderer) {
      switch (actionName) {
        case 'POWER_SAG_HUM':
          if (typeof CipherAudio !== 'undefined') {
            CipherAudio.transformerHum(1.0, true);
          }
          const busTag = document.getElementById('header-bus-tag');
          if (busTag) busTag.textContent = 'BUS: 11.5V SINKING';
          break;

        case 'TRIGGER_HARDWARE_COLLAPSE':
          if (typeof CipherFX !== 'undefined') {
            const shell = document.getElementById('master-shell') || document.body;
            CipherFX.brownout(shell, () => {
              CipherFX.collapse(shell, () => {
                shell.classList.add('glitched-state');
                const brand = document.getElementById('header-brand-txt');
                const bus = document.getElementById('header-bus-tag');
                const frameHdr = document.getElementById('crt-frame-header');

                if (brand) { brand.textContent = '⚠ FIELD UNIT // POWER SINK'; brand.style.color = 'var(--crt-alert)'; }
                if (bus) { bus.textContent = 'BUS: 11.2V CRITICAL'; bus.style.color = 'var(--crt-alert)'; }
                if (frameHdr) { frameHdr.textContent = 'EMERGENCY TRIAGE // BATTERY RAIL COLLAPSE'; frameHdr.style.color = 'var(--crt-alert)'; }
              });
            });
          }
          break;

        case 'OPEN_TRIAGE_PAGE':
          if (typeof CipherAudio !== 'undefined') CipherAudio.keyThud();
          window.location.href = 'triage.html';
          break;
      }
    },

    advanceToStage: function (nextStageId, terminalRenderer) {
      currentStageId = nextStageId;
      const stage = this.getCurrentStage();
      if (!stage) return;

      const screenText = interpolateText(stage.screenText);
      const spokenText = interpolateText(stage.spokenText);

      // Render Screen Text
      terminalRenderer.printLine(`\n${screenText}`, "line-glitch");

      // Synchronize Spoken Audio
      if (spokenText && typeof CipherAudio !== 'undefined') {
        CipherAudio.speak(spokenText);
      }

      // Re-render Quick-Tap Buttons
      if (stage.buttons) {
        terminalRenderer.renderButtons(stage.buttons);
      }
    }
  };
})();
