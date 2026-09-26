/**
 * C.I.P.H.E.R. Acoustic Audio Core & Speech Synthesizer (v5.0)
 * Module 01: Cache Tales Architecture
 * 
 * Synthesizes analog relay ladder clicks, 12V bench power hums,
 * 1/4-inch casing metallic clanks, squelch tails, and rotary Cypher-Wheel ratchets.
 */

const CipherAudio = (function () {
  let audioCtx = null;
  let voiceEnabled = true;

  function getContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  return {
    /**
     * Unlock AudioContext on initial user gesture (required for mobile/in-dash browsers)
     */
    unlock: function () {
      try {
        const ctx = getContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (e) {
        console.warn("[C.I.P.H.E.R. Audio] Context unlock bypassed:", e);
      }
    },

    init: function () {
      this.unlock();
    },

    isVoiceEnabled: function () {
      return voiceEnabled;
    },

    toggleVoice: function () {
      voiceEnabled = !voiceEnabled;
      return voiceEnabled;
    },

    /**
     * Standard mechanical teletype / keyboard click
     */
    click: function () {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.035);
      } catch (e) {}
    },

    /**
     * Heavy terminal key-thud (high-mass mechanical switches)
     */
    keyThud: function () {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.45, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    },

    /**
     * Rapid serial carrier chatter burst
     */
    lineChatter: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;
        const count = 3;
        for (let i = 0; i < count; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(600 + Math.random() * 400, now + (i * 0.015));
          gain.gain.setValueAtTime(0.12, now + (i * 0.015));
          gain.gain.linearRampToValueAtTime(0.001, now + (i * 0.015) + 0.012);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.015));
          osc.stop(now + (i * 0.015) + 0.014);
        }
      } catch (e) {}
    },

    /**
     * Rotary Ratchet Tooth Tick (Different pitch for Inner vs Outer wheels)
     */
    wheelTick: function (isOuter = false) {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const baseFreq = isOuter ? 950 : 1600;
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.25, ctx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.025);
      } catch (e) {}
    },

    /**
     * Mechanical Lock Detent Snap (Dual-harmonic heavy latch)
     */
    wheelSlam: function () {
      try {
        const ctx = getContext();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(220, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.18);
        osc2.stop(ctx.currentTime + 0.18);
      } catch (e) {}
    },

    /**
     * 12V Industrial Relay Step / Solenoid Click
     */
    relay: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        // Coil energize snap
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(320, now);
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.05);
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.055);

        // Contact bounce tick
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1800, now + 0.02);
        osc2.frequency.linearRampToValueAtTime(300, now + 0.04);
        gain2.gain.setValueAtTime(0.3, now + 0.02);
        gain2.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.02);
        osc2.stop(now + 0.045);
      } catch (e) {}
    },

    /**
     * Percussive Maintenance: 1/4-inch welded steel casing clank
     */
    clank: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        // Low-end steel thud
        const oscLow = ctx.createOscillator();
        const gainLow = ctx.createGain();
        oscLow.type = 'sawtooth';
        oscLow.frequency.setValueAtTime(95, now);
        oscLow.frequency.exponentialRampToValueAtTime(25, now + 0.35);
        gainLow.gain.setValueAtTime(0.8, now);
        gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        oscLow.connect(gainLow);
        gainLow.connect(ctx.destination);
        oscLow.start(now);
        oscLow.stop(now + 0.4);

        // High metallic sheet ringing resonance
        const oscRing = ctx.createOscillator();
        const gainRing = ctx.createGain();
        oscRing.type = 'sine';
        oscRing.frequency.setValueAtTime(1120, now);
        oscRing.frequency.exponentialRampToValueAtTime(740, now + 0.28);
        gainRing.gain.setValueAtTime(0.4, now);
        gainRing.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        oscRing.connect(gainRing);
        gainRing.connect(ctx.destination);
        oscRing.start(now);
        oscRing.stop(now + 0.32);
      } catch (e) {}
    },

    /**
     * Line error / brownout buzz
     */
    buzz: function () {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } catch (e) {}
    },

    /**
     * Upward harmonic parity chime
     */
    chime: function () {
      try {
        const ctx = getContext();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.36);
        });
      } catch (e) {}
    },

    /**
     * Analog radio squelch tail
     */
    squelchTail: function () {
      try {
        const ctx = getContext();
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } catch (e) {}
    },

    /**
     * Push-to-talk mic click
     */
    micClick: function () {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      } catch (e) {}
    },

    /**
     * Web Speech API integration with faction-tuned pitch
     */
    speak: function (text) {
      if (!voiceEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.65;
      utterance.rate = 1.05;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };
})();

// Attach to window object for global module accessibility
window.CipherAudio = CipherAudio;
