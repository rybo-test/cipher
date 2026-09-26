/**
 * C.I.P.H.E.R. Dynamic Narrative & Faction Dialogue Engine (v5.0)
 * Module 01: Cache Tales Architecture
 * 
 * Manages dual-personality conversational trees, mid-sentence firmware identity glitches,
 * operator progression (Friend -> Buddy), and scenario dispatching across both surfaces.
 * Strictly adheres to Master Canon Section 2, Section 3, and Section 5.1.
 */

const CipherDialog = (function () {
  // Active conversation state
  let currentArcId = 'MISSION_COMMAND_ARC';
  let currentNodeId = 'START';
  let lastSpeaker = 'RSI';

  /**
   * Helper: Resolves dynamic player callsign and role progression
   */
  function getOperatorContext() {
    let callsign = 'FELLOW_CACHER';
    let role = 'FRIEND';

    try {
      if (typeof CipherCore !== 'undefined' && CipherCore.getState) {
        const s = CipherCore.getState();
        if (s && s.cacher) {
          if (s.cacher.username && s.cacher.username !== 'GUEST_CACHER') {
            callsign = s.cacher.username;
          }
          if (s.cacher.role) {
            role = s.cacher.role;
          }
        }
      }
    } catch (e) {
      console.warn('[C.I.P.H.E.R. Dialog] State retrieval deferred:', e);
    }

    return { callsign, role };
  }

  /**
   * Dialogue Script Registry
   */
  const scriptRegistry = {
    MISSION_COMMAND_ARC: {
      START: {
        speaker: 'RSI',
        getText: function () {
          const { callsign } = getOperatorContext();
          return (
            `"Keep your boots on the rug and go easy on the switch bank, friend.\n` +
            `Remote gateway is holding steady, but the deep-cycle battery tap on the bench is reading twelve point four volts.\n` +
            `The 433.92 MHz carrier benchmark has a cold solder joint acting up on relay five, but we've got Ground Zero coordinates locked for that thirty-cal ammo can tucked out along the bench.\n` +
            `What's your plan, ${callsign}?"`
          );
        },
        choices: [
          { label: "📍 SHOW COORDINATES", textToSend: "SHOW COORDINATES", nextNode: "COORDS_NODE" },
          { label: "🔍 CONTAINER HINT", textToSend: "CONTAINER HINT", nextNode: "HINT_NODE" },
          { label: "⚙️ RUN DIAGNOSTICS", textToSend: "DIAG", nextNode: "DIAG_NODE" },
          { label: "⚡ SWITCH FIRMWARE", textToSend: "FLIP", nextNode: "GLITCH_COLLISION_NODE" }
        ]
      },

      COORDS_NODE: {
        speaker: 'RSI',
        getText: function () {
          return (
            `"Ground Zero coords verified off the benchmark line, friend.\n` +
            `COORDS: N 41° 44.XXX  W 111° 49.XXX (WGS84 datum).\n` +
            `Target is a standard 30-cal ammo can chained to a limestone shelf on the bench.\n` +
            `Remember the golden rule: BYOP. If your ink isn't on that paper log sheet, your smiley isn't earned."`
          );
        },
        choices: [
          { label: "🔍 CHECK PLACEMENT HINT", textToSend: "CONTAINER HINT", nextNode: "HINT_NODE" },
          { label: "📦 SWAG INVENTORY", textToSend: "SWAG", nextNode: "SWAG_NODE" },
          { label: "💥 KICK CASING", textToSend: "KICK", nextNode: "KICK_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "START" }
        ]
      },

      HINT_NODE: {
        speaker: 'RSI',
        getText: function () {
          return (
            `"Field placement notes from the garage logbook:\n` +
            `Look low beneath the northern limestone overhang where the juniper roots twist into the rock fissure.\n` +
            `Keep your hands out of the loose shale and don't tear down any stone walls. Container is olive drab with an RSI weld stencil.\n` +
            `Watch your back for muggles walking dogs along the trail."`
          );
        },
        choices: [
          { label: "📍 GET COORDINATES", textToSend: "SHOW COORDINATES", nextNode: "COORDS_NODE" },
          { label: "⚙️ CYPHER WHEEL TOOL", textToSend: "OPEN CYPHER TOOL", nextNode: "HINT_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "START" }
        ]
      },

      DIAG_NODE: {
        speaker: 'RSI',
        getText: function () {
          return (
            `"RSI BENCH TEST // LADDER RELAY LOGIC:\n` +
            `POWER: 12.4V DC deep-cycle lead-acid tap (Nominal float).\n` +
            `CARRIER: 433.92 MHz garage whip antenna line verified.\n` +
            `RELAYS: Relays 00 through 60 contacts closed and clean.\n` +
            `WARNING: Relay 70 has an unauthorized Acme bypass soldered across pin four.\n` +
            `Let's finish this before the shift whistle blows and Taco Time Tuesday wraps up."`
          );
        },
        choices: [
          { label: "⚡ INSPECT RELAY 70", textToSend: "INSPECT RELAY 70", nextNode: "GLITCH_COLLISION_NODE" },
          { label: "📍 SHOW COORDINATES", textToSend: "SHOW COORDINATES", nextNode: "COORDS_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "START" }
        ]
      },

      GLITCH_COLLISION_NODE: {
        speaker: 'RATPACK',
        getText: function () {
          const { callsign } = getOperatorContext();
          return (
            `"BEEP BEEP! Look who bypassed the gate, buddy!\n` +
            `That old steelworker clunker was choking on rusty relay clicks, so I wired the Nitro-Injected Whirligig straight into the Acme Brain-Box 9000!\n` +
            `The Bird-in-the-Sky Pinger is hot, coords are singing, and ${callsign} is in the driver's seat!\n` +
            `We gotta sprint to GZ and snag that FTF before an Anvil-Drop Error crashes our smiley hopper!"`
          );
        },
        choices: [
          { label: "📍 PING GZ TARGET", textToSend: "SHOW COORDINATES", nextNode: "RATPACK_COORDS_NODE" },
          { label: "🔍 SNIFF CONTAINER HINT", textToSend: "CONTAINER HINT", nextNode: "RATPACK_HINT_NODE" },
          { label: "📦 ACME SWAG HOPPER", textToSend: "SWAG", nextNode: "RATPACK_SWAG_NODE" },
          { label: "⚡ RESTORE RSI FIRMWARE", textToSend: "RESTORE RSI", nextNode: "START" }
        ]
      },

      RATPACK_COORDS_NODE: {
        speaker: 'RATPACK',
        getText: function () {
          return (
            `"BIRD-IN-THE-SKY SATELLITE PINGER LOCKED ON GZ!\n` +
            `COORDS: N 41° 44.XXX  W 111° 49.XXX\n` +
            `Ammo can is buried under the limestone shelf! Grab your pack, check your GPS, and burn rubber!\n` +
            `If another cacher logs that FTF first, I'm gonna blow an Acme spring!"`
          );
        },
        choices: [
          { label: "🔍 SNIFF HINT", textToSend: "CONTAINER HINT", nextNode: "RATPACK_HINT_NODE" },
          { label: "💥 APPLY PERCUSSION", textToSend: "KICK", nextNode: "KICK_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "GLITCH_COLLISION_NODE" }
        ]
      },

      RATPACK_HINT_NODE: {
        speaker: 'RATPACK',
        getText: function () {
          return (
            `"WHOA NELLY! Here's the inside scoop, buddy:\n` +
            `Look low under the northern limestone overhang where the juniper roots look like twisted licorice!\n` +
            `No muggles snooping around, no bushwhacking required. Just grab the ammo can, sign the paper log sheet, and stash the swag!"`
          );
        },
        choices: [
          { label: "📍 PING GZ TARGET", textToSend: "SHOW COORDINATES", nextNode: "RATPACK_COORDS_NODE" },
          { label: "⚙️ CYPHER WHEEL TOOL", textToSend: "OPEN CYPHER TOOL", nextNode: "RATPACK_HINT_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "GLITCH_COLLISION_NODE" }
        ]
      },

      SWAG_NODE: {
        speaker: 'RSI',
        getText: function () {
          return (
            `"Virtual trade items logged in the ammo can cache:\n` +
            `  • 1x Northern Utah Geocachers wooden nickel\n` +
            `  • 1x Plastic dinosaur with a missing left foot\n` +
            `  • 1x Unactivated micro trackable geocoin\n` +
            `  • 1x Expired 2004 Taco Time coupon (hot sauce stained)\n` +
            `Standard trail rules apply, friend: trade equal or trade up."`
          );
        },
        choices: [
          { label: "📍 SHOW COORDINATES", textToSend: "SHOW COORDINATES", nextNode: "COORDS_NODE" },
          { label: "🔍 CONTAINER HINT", textToSend: "CONTAINER HINT", nextNode: "HINT_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "START" }
        ]
      },

      RATPACK_SWAG_NODE: {
        speaker: 'RATPACK',
        getText: function () {
          return (
            `"KABOOM! LOOK AT THIS SWAG HOPPER, BUDDY!\n` +
            `We got a gnarly plastic dino, an unactivated trackable geocoin waiting for mileage, a signature wooden nickel, and an antique Taco Time coupon!\n` +
            `Drop your signature swag token in the can and trade equal or trade up!"`
          );
        },
        choices: [
          { label: "📍 PING GZ TARGET", textToSend: "SHOW COORDINATES", nextNode: "RATPACK_COORDS_NODE" },
          { label: "🔍 CONTAINER HINT", textToSend: "CONTAINER HINT", nextNode: "RATPACK_HINT_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "GLITCH_COLLISION_NODE" }
        ]
      },

      KICK_NODE: {
        speaker: 'RSI',
        getText: function () {
          return (
            `"*CLANG!* You kicked the quarter-inch welded steel casing.\n` +
            `A shower of rust flakes falls off the bracket and an earwig scrambles off pin four.\n` +
            `The 12V bench tap fluctuates briefly, but that heavy plate was welded in a steel mill in eighty-seven. Not even a dent."`
          );
        },
        choices: [
          { label: "📍 SHOW COORDINATES", textToSend: "SHOW COORDINATES", nextNode: "COORDS_NODE" },
          { label: "🔍 CONTAINER HINT", textToSend: "CONTAINER HINT", nextNode: "HINT_NODE" },
          { label: "↩️ BACK TO MENU", textToSend: "MENU", nextNode: "START" }
        ]
      }
    }
  };

  return {
    /**
     * Initializes dialogue router to specific arc
     */
    init: function (arcId = 'MISSION_COMMAND_ARC') {
      currentArcId = arcId;
      currentNodeId = 'START';
    },

    /**
     * Retrieves current node definition
     */
    getCurrentNode: function () {
      const arc = scriptRegistry[currentArcId] || scriptRegistry.MISSION_COMMAND_ARC;
      return arc[currentNodeId] || arc.START;
    },

    /**
     * Core Command & Script Dispatcher
     * Compatible with both Desktop and Handheld UI renderers
     */
    processInput: function (rawInput, renderer) {
      if (!rawInput) return;
      const cleanInput = rawInput.trim();
      const upper = cleanInput.toUpperCase();

      const arc = scriptRegistry[currentArcId] || scriptRegistry.MISSION_COMMAND_ARC;
      const currentNode = arc[currentNodeId] || arc.START;

      // 1. Direct Global Verb Intercepts
      if (upper === 'FLIP' || upper === 'IDENTITY' || upper === 'SWITCH FIRMWARE' || upper === 'INSPECT RELAY 70') {
        currentNodeId = (currentNode.speaker === 'RSI') ? 'GLITCH_COLLISION_NODE' : 'START';
        this.renderCurrentNode(renderer, true);
        return;
      }

      if (upper === 'RESTORE RSI') {
        currentNodeId = 'START';
        this.renderCurrentNode(renderer, true);
        return;
      }

      if (upper === 'COORDS' || upper === 'SHOW COORDINATES' || upper === 'PING GZ TARGET') {
        currentNodeId = (currentNode.speaker === 'RATPACK') ? 'RATPACK_COORDS_NODE' : 'COORDS_NODE';
        this.renderCurrentNode(renderer);
        return;
      }

      if (upper === 'HINT' || upper === 'CONTAINER HINT' || upper === 'SNIFF CONTAINER HINT') {
        currentNodeId = (currentNode.speaker === 'RATPACK') ? 'RATPACK_HINT_NODE' : 'HINT_NODE';
        this.renderCurrentNode(renderer);
        return;
      }

      if (upper === 'DIAG') {
        currentNodeId = 'DIAG_NODE';
        this.renderCurrentNode(renderer);
        return;
      }

      if (upper === 'SWAG' || upper === 'ACME SWAG HOPPER') {
        currentNodeId = (currentNode.speaker === 'RATPACK') ? 'RATPACK_SWAG_NODE' : 'SWAG_NODE';
        this.renderCurrentNode(renderer);
        return;
      }

      if (upper === 'KICK' || upper === 'PERCUSSIVE KICK' || upper === 'APPLY PERCUSSION') {
        currentNodeId = 'KICK_NODE';
        if (typeof CipherAudio !== 'undefined' && CipherAudio.clank) {
          CipherAudio.clank();
        }
        this.renderCurrentNode(renderer);
        return;
      }

      if (upper === 'BYOP') {
        if (renderer && renderer.printLine) {
          renderer.printLine(
            `"Always bring your own pen out on the trail, friend.\n` +
            `C.I.P.H.E.R. can decode virtual memory registers all day, but if your signature isn't on that paper log sheet in the ammo can, your smiley doesn't count."`
          );
        }
        return;
      }

      if (upper === 'TFTC') {
        if (renderer && renderer.printLine) {
          renderer.printLine(
            `"TFTC! Thanks for the cache! Log sheet signed, container re-hidden exactly as found, and coordinates secured."`
          );
        }
        return;
      }

      if (upper === 'MENU' || upper === 'HELP') {
        currentNodeId = (currentNode.speaker === 'RATPACK') ? 'GLITCH_COLLISION_NODE' : 'START';
        this.renderCurrentNode(renderer);
        return;
      }

      // 2. Choice Matching
      if (currentNode && currentNode.choices) {
        const matched = currentNode.choices.find(c => 
          c.textToSend.toUpperCase() === upper || 
          c.label.toUpperCase().includes(upper)
        );

        if (matched && matched.nextNode && arc[matched.nextNode]) {
          currentNodeId = matched.nextNode;
          this.renderCurrentNode(renderer);
          return;
        }
      }

      // 3. Fallback Snark / Dialogue Collision
      if (typeof CipherCore !== 'undefined' && CipherCore.registerInputFailure) {
        const fail = CipherCore.registerInputFailure();
        if (renderer && renderer.printLine) {
          renderer.printLine(fail.message);
        }
      } else {
        if (renderer && renderer.printLine) {
          const fallbackMsg = (currentNode.speaker === 'RATPACK')
            ? `"WHOA NELLY! Command '${cleanInput}' tripped an Acme Anvil-Drop Error! Choose a valid option from the thumb dock, buddy!"`
            : `"Take it slow, friend. Command '${cleanInput}' didn't register across the relay ladder. Check your wiring leads."`;
          renderer.printLine(fallbackMsg);
        }
      }
    },

    /**
     * Renders active node text and options to the caller surface
     */
    renderCurrentNode: function (renderer, isGlitchTransition = false) {
      if (!renderer) return;

      const node = this.getCurrentNode();
      const text = node.getText ? node.getText() : node.text;

      // Handle glitch flip trigger if speaker changes
      if (isGlitchTransition && typeof CipherFX !== 'undefined' && CipherFX.quantumFlip) {
        const targetSurface = document.getElementById('glass-screen-surface') || 
                              document.getElementById('handheld-view') || 
                              document.body;

        CipherFX.quantumFlip(targetSurface, () => {
          if (renderer.printLine) {
            renderer.printLine(text);
          }
          if (renderer.renderButtons && node.choices) {
            renderer.renderButtons(node.choices);
          }
        });
        return;
      }

      // Standard render
      if (renderer.printLine) {
        renderer.printLine(text);
      }
      if (renderer.renderButtons && node.choices) {
        renderer.renderButtons(node.choices);
      }

      // Diegetic Speech Synthesis
      if (typeof CipherAudio !== 'undefined' && CipherAudio.speak && CipherAudio.isVoiceEnabled()) {
        const cleanSpeech = text.replace(/\[.*?\]/g, '').replace(/[*#•]/g, '').substring(0, 140);
        CipherAudio.speak(cleanSpeech);
      }
    }
  };
})();

// Attach to window object for universal module accessibility
window.CipherDialog = CipherDialog;
