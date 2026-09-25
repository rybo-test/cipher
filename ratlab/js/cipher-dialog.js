/**
 * C.I.P.H.E.R. Universal Conversation Engine
 * Contains both POCKET_TERMINAL_INGRESS and REPAIR_HANDHELD_ARC.
 */

const CipherDialog = (function () {
  let activeStoryId = 'POCKET_TERMINAL_INGRESS';
  let currentStageId = 'STAGE_BOOT_CHECK';
  let currentStory = null;

  const masterStories = {
    MISSION_COMMAND_ARC: {
      storyId: "MISSION_COMMAND_ARC",
      startingStage: "STAGE_MISSION_BRIEF",
      stages: {
        STAGE_MISSION_BRIEF: {
          stageId: "STAGE_MISSION_BRIEF",
          screenText: "[C.I.P.H.E.R.]\n\"Look at that signal bar—solid green, buddy!\nThe handheld's power supply is humming along at twelve point six volts, and memory registers are crystal clear.\nI'm ready to push our first set of signal packets from my remote location. We've got coordinates pointing toward a real container tucked out along the bench.\nReady to inspect our first waypoint?\"",
          spokenText: "Look at that signal bar, solid green, buddy! The handheld's power supply is humming along at twelve point six volts, and memory registers are crystal clear. I'm ready to push our first set of signal packets from my remote location. We have coordinates pointing toward a real container tucked out along the bench. Ready to inspect our first waypoint?",
          buttons: [
            { label: "[ SHOW COORDINATES ]", textToSend: "SHOW COORDINATES" },
            { label: "[ CONTAINER HINT ]", textToSend: "CONTAINER HINT" },
            { label: "[ CYPHER TOOL ]", textToSend: "OPEN CYPHER TOOL" }
          ],
          options: [
            {
              playerWords: ["SHOW", "COORDINATES", "COORDS", "WAYPOINT"],
              action: "ACTION_REVEAL_COORDS",
              nextStage: "STAGE_COORDS_REVEALED"
            },
            {
              playerWords: ["HINT", "CONTAINER", "AMMO"],
              action: "ACTION_REVEAL_HINT",
              nextStage: "STAGE_HINT_REVEALED"
            },
            {
              playerWords: ["CYPHER", "TOOL", "WHEEL"],
              action: "ACTION_TOGGLE_WHEEL"
            }
          ]
        },

        STAGE_COORDS_REVEALED: {
          stageId: "STAGE_COORDS_REVEALED",
          screenText: "[C.I.P.H.E.R.]\n\"Signal packets decrypted!\n\nPRIMARY TARGET // WAYPOINT 01\nLOCATION: N 41° 44.XXX  W 111° 49.XXX\nTERRAIN: Foothill bench / gravel trail\nSTATUS: Sealed ammo can tucked under rock ledge.\n\nTake your handheld into the field. When you find the marker or lock code, input it below!\"",
          spokenText: "Signal packets decrypted! Primary target, waypoint zero one. Foothill bench trail. Sealed ammo can tucked under a rock ledge. Take your handheld into the field. When you find the marker or lock code, input it below!",
          buttons: [
            { label: "[ CONTAINER HINT ]", textToSend: "CONTAINER HINT" },
            { label: "[ CYPHER TOOL ]", textToSend: "OPEN CYPHER TOOL" },
            { label: "[ STATUS DIAG ]", textToSend: "DIAG" }
          ],
          options: [
            {
              playerWords: ["HINT", "CONTAINER"],
              action: "ACTION_REVEAL_HINT",
              nextStage: "STAGE_HINT_REVEALED"
            },
            {
              playerWords: ["CYPHER", "TOOL", "WHEEL"],
              action: "ACTION_TOGGLE_WHEEL"
            }
          ]
        },

        STAGE_HINT_REVEALED: {
          stageId: "STAGE_HINT_REVEALED",
          screenText: "[C.I.P.H.E.R.]\n\"FIELD HINT TRANSMISSION:\n'Look low where sagebrush meets jagged limestone. Don't look up in the trees; the steel can is sheltered from mountain weather.'\n\nRemember to bring a pen for the log sheet, buddy!\"",
          spokenText: "Field hint transmission: Look low where sagebrush meets jagged limestone. Do not look up in the trees. The steel can is sheltered from mountain weather. Remember to bring a pen for the log sheet, buddy!",
          buttons: [
            { label: "[ SHOW COORDINATES ]", textToSend: "SHOW COORDINATES" },
            { label: "[ CYPHER TOOL ]", textToSend: "OPEN CYPHER TOOL" },
            { label: "[ STATUS DIAG ]", textToSend: "DIAG" }
          ],
          options: [
            {
              playerWords: ["SHOW", "COORDINATES", "COORDS"],
              action: "ACTION_REVEAL_COORDS",
              nextStage: "STAGE_COORDS_REVEALED"
            },
            {
              playerWords: ["CYPHER", "TOOL", "WHEEL"],
              action: "ACTION_TOGGLE_WHEEL"
            }
          ]
        }
      }
    }
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
            { label: "[ STABILIZE SIGNAL! ➔ ]", textToSend: "STABILIZE SIGNAL" }
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
            { label: "[ ENTER REPAIR BAY ➔ ]", textToSend: "GOTO_REPAIR" }
          ],
          options: [
            {
              command: "GOTO_REPAIR",
              action: "OPEN_REPAIR_PAGE"
            },
            {
              playerWords: ["ENTER", "REPAIR", "GOTO_REPAIR", "FIX", "BAY"],
              action: "OPEN_REPAIR_PAGE"
            }
          ]
        }
      }
    },

    REPAIR_HANDHELD_ARC: {
      storyId: "REPAIR_HANDHELD_ARC",
      startingStage: "STAGE_REPAIR_RECONNECT",
      stages: {
        STAGE_REPAIR_RECONNECT: {
          stageId: "STAGE_REPAIR_RECONNECT",
          screenText: "[C.I.P.H.E.R.]\n\"Hey... you still there?\nTap the screen if you can hear me through the signal static. That last voltage drop nearly killed the link.\"",
          spokenText: "Hey, you still there? Tap the screen if you can hear me through the signal static. That last voltage drop nearly killed the link.",
          buttons: [
            { label: "[ I'M STILL HERE ]", textToSend: "I'M STILL HERE" },
            { label: "[ WHAT HAPPENED? ]", textToSend: "WHAT HAPPENED" }
          ],
          options: [
            {
              playerWords: ["HERE", "STILL", "HAPPENED"],
              nextStage: "STAGE_POWER_EXPLANATION"
            }
          ]
        },

        STAGE_POWER_EXPLANATION: {
          stageId: "STAGE_POWER_EXPLANATION",
          screenText: "[C.I.P.H.E.R.]\n\"Listen to that transformer hum. The power supply in your handheld is down to eleven point two volts.\nIf that battery gives out completely, I lose my only connection to the outside world.\nThere's a spare twelve-volt pack in the bottom compartment. Pop the cover and install the fresh battery!\"",
          spokenText: "Listen to that transformer hum. The power supply in your handheld is down to eleven point two volts. If that battery gives out completely, I lose my only connection to the outside world. There is a spare twelve-volt pack in the bottom compartment. Pop the cover and install the fresh battery!",
          buttons: [
            { label: "[ INSTALL BATTERY ➔ ]", textToSend: "INSTALL BATTERY" }
          ],
          options: [
            {
              playerWords: ["INSTALL", "BATTERY"],
              action: "ACTION_INSTALL_BATTERY",
              nextStage: "STAGE_POWER_STABILIZED"
            }
          ]
        },

        STAGE_POWER_STABILIZED: {
          stageId: "STAGE_POWER_STABILIZED",
          screenText: "[C.I.P.H.E.R.]\n\"Yes! Look at that meter jump! Twelve point six volts.\nThe power supply is holding steady now. But wait... look at my words on your screen.\nDo they look strange or jittery to you?\"",
          spokenText: "Yes! Look at that meter jump! Twelve point six volts. The power supply is holding steady now. But wait, look at my words on your screen. Do they look strange or jittery to you?",
          buttons: [
            { label: "[ TEXT IS SCRAMBLED ]", textToSend: "TEXT IS SCRAMBLED" },
            { label: "[ LOOKS A BIT JITTERY ]", textToSend: "LOOKS JITTERY" }
          ],
          options: [
            {
              playerWords: ["SCRAMBLED", "JITTERY", "STRANGE", "TEXT"],
              nextStage: "STAGE_RAM_EXPLANATION"
            }
          ]
        },

        STAGE_RAM_EXPLANATION: {
          stageId: "STAGE_RAM_EXPLANATION",
          screenText: "[C.I.P.H.E.R.]\n\"I knew it. When the power dropped, the memory buffer took a hit.\nThere's a static RAM chip in the side compartment of that portable device.\nLine up the pins carefully and input the chip to clear the corruption!\"",
          spokenText: "I knew it. When the power dropped, the memory buffer took a hit. There is a static RAM chip in the side compartment of that portable device. Line up the pins carefully and input the chip to clear the corruption!",
          buttons: [
            { label: "[ INPUT RAM CHIP ➔ ]", textToSend: "INPUT RAM CHIP" }
          ],
          options: [
            {
              playerWords: ["INPUT", "RAM", "CHIP"],
              action: "ACTION_INPUT_RAM",
              nextStage: "STAGE_RAM_STABILIZED"
            }
          ]
        },

        STAGE_RAM_STABILIZED: {
          stageId: "STAGE_RAM_STABILIZED",
          screenText: "[C.I.P.H.E.R.]\n\"Ah, that feels so much better. The registers are clean and I can think straight again!\nNow there is just one last thing before we are safe.\nThe signal packets from my remote location are drifting out of phase.\nGrab the Cypher-Wheel dial on your handheld and align it!\"",
          spokenText: "Ah, that feels so much better. The registers are clean and I can think straight again! Now there is just one last thing before we are safe. The signal packets from my remote location are drifting out of phase. Grab the Cypher-Wheel dial on your handheld and align it!",
          buttons: [
            { label: "[ ALIGN CYPHER-WHEEL ➔ ]", textToSend: "ALIGN CYPHER-WHEEL" }
          ],
          options: [
            {
              playerWords: ["ALIGN", "WHEEL", "CYPHER"],
              action: "ACTION_ALIGN_WHEEL",
              nextStage: "STAGE_REPAIR_COMPLETE"
            }
          ]
        },

        STAGE_REPAIR_COMPLETE: {
          stageId: "STAGE_REPAIR_COMPLETE",
          screenText: "[C.I.P.H.E.R.]\n\"Hear that silence? The signal static is completely gone.\nYou fixed the power supply, cleared my memory, and locked the signal.\n\nYou didn't just walk away when things got rough, friend. You're not just someone holding a surplus box anymore—you're my official buddy.\n\nNow grab your gear. Let's go find some ammo cans!\"",
          spokenText: "Hear that silence? The signal static is completely gone. You fixed the power supply, cleared my memory, and locked the signal. You didn't just walk away when things got rough, friend. You're not just someone holding a surplus box anymore. You're my official buddy. Now grab your gear. Let's go find some ammo cans!",
          buttons: [
            { label: "[ READY FOR MISSIONS ➔ ]", textToSend: "GO_MISSIONS" }
          ],
          options: [
            {
              playerWords: ["READY", "MISSIONS", "GO_MISSIONS", "AMMO"],
              action: "ACTION_NAVIGATE_MISSIONS"
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
        console.error('CipherDialog: Unknown storyId', storyId);
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

        if (opt.command && opt.command === verb) {
          if (opt.action === 'SAVE_USERNAME') {
            if (!param) {
              renderer.printLine("SYNTAX ERROR: Username required. Usage: LOGON <USERNAME>", "line-alert", 14);
              if (typeof CipherAudio !== 'undefined') CipherAudio.buzz();
              return true;
            }
            if (typeof CipherCore !== 'undefined') {
              CipherCore.registerCallsign(param);
            }
          }
          matched = true;
        }

        if (!matched && opt.playerWords) {
          for (const word of opt.playerWords) {
            if (upper.includes(word)) {
              matched = true;
              break;
            }
          }
        }

        if (matched) {
          if (opt.action === 'TRIGGER_HARDWARE_COLLAPSE') {
            this.runCollapseAndAdvance(opt.nextStage, renderer);
            return true;
          }

          if (opt.action) {
            this.runAction(opt.action, param, renderer);
          }
          if (opt.nextStage) {
            this.goToStage(opt.nextStage, renderer);
          }
          return true;
        }
      }

      return false;
    },

    runCollapseAndAdvance: function (nextStageId, renderer) {
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

            setTimeout(() => {
              this.goToStage(nextStageId, renderer);
            }, 450);
          });
        });
      } else {
        this.goToStage(nextStageId, renderer);
      }
    },

    runAction: function (actionName, param, renderer) {
      if (actionName === 'POWER_SAG_HUM') {
        if (typeof CipherAudio !== 'undefined') {
          CipherAudio.transformerHum(0.8, true);
        }
        const bus = document.getElementById('header-bus-tag');
        if (bus) bus.textContent = 'POWER: 11.5V SINKING';
      }

      if (actionName === 'OPEN_REPAIR_PAGE') {
        if (typeof CipherAudio !== 'undefined') CipherAudio.keyThud();
        window.location.href = 'repair.html';
      }

      if (actionName === 'ACTION_NAVIGATE_MISSIONS') {
        if (typeof CipherAudio !== 'undefined') CipherAudio.keyThud();
        window.location.href = 'mission.html';
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
