/**
 * C.I.P.H.E.R. Acoustic Core & Chassis Sound Synthesizer (v4.4 - CT-105 Audited)
 * Web Audio API engine providing low-pass filtered, low-volume mechanical chassis
 * acoustics, 60Hz transformer power hums, and CRT flyback discharge snaps.
 */

const CipherAudio = (function () {
  let audioCtx = null;
  let masterFilter = null;
  let masterGain = null;
  let voiceEnabled = true;

  function initAudioGraph() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master Biquad Low-Pass Filter: Cuts off harsh frequencies above 750Hz
      masterFilter = audioCtx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(750, audioCtx.currentTime);
      masterFilter.Q.setValueAtTime(1.2, audioCtx.currentTime);

      // Master Gain: Caps peak volume to a comfortable 22%
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.22, audioCtx.currentTime);

      masterFilter.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  return {
    isVoiceEnabled: function () {
      return voiceEnabled;
    },

    toggleVoice: function () {
      voiceEnabled = !voiceEnabled;
      return voiceEnabled;
    },

    // Unlock helper for first mobile interaction
    unlock: function () {
      initAudioGraph();
    },

    /**
     * Tactile Mechanical Key Thud
     * Muffled chassis key-depression sound for button taps and CLI EXEC.
     */
    keyThud: function () {
      try {
        const ctx = initAudioGraph();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(155, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.045);

        osc.connect(gain);
        gain.connect(masterFilter);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    },

    /**
     * Mechanical Line Feed Chatter
     * Soft, muffled solenoid rattle on line completion (replaces per-character clicks).
     */
    lineChatter: function () {
      try {
        const ctx = initAudioGraph();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.035);

        osc.connect(gain);
        gain.connect(masterFilter);

        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    },

    /**
     * 60Hz Transformer Mains Hum (Brownout Simulation)
     * Simulates the low electrical hum of an overloaded power transformer.
     * @param {number} duration Duration in seconds
     * @param {boolean} sag If true, pitches down to simulate voltage drop
     */
    transformerHum: function (duration = 0.6, sag = false) {
      try {
        const ctx = initAudioGraph();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        const baseFreq = 60; // 60Hz AC mains hum
        osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime); // 120Hz harmonic

        if (sag) {
          // Pitch sags as voltage rail drops
          osc1.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + duration);
          osc2.frequency.exponentialRampToValueAtTime(84, ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterFilter);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + duration);
        osc2.stop(ctx.currentTime + duration);
      } catch (e) {}
    },

    /**
     * Flyback Deflection Pop
     * High-voltage arc snap when the CRT vertical deflection collapses.
     */
    flybackPop: function () {
      try {
        const ctx = initAudioGraph();
        const bufferSize = ctx.sampleRate * 0.04;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.038);

        noise.connect(gain);
        gain.connect(masterFilter);

        noise.start();
      } catch (e) {}
    },

    /**
     * Muffled Mechanical Detent Tick (For Cypher-Wheel)
     */
    wheelTick: function (isOuter = false) {
      try {
        const ctx = initAudioGraph();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const base = isOuter ? 220 : 340;
        osc.frequency.setValueAtTime(base, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.02);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(masterFilter);

        osc.start();
        osc.stop(ctx.currentTime + 0.025);
      } catch (e) {}
    },

    /**
     * Heavy Detent Solenoid Slam (For Cypher-Wheel Lock)
     */
    wheelSlam: function () {
      try {
        const ctx = initAudioGraph();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

        osc.connect(gain);
        gain.connect(masterFilter);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    },

    /**
     * Relay Squelch Burst (For Radio & Cognitive Transition)
     */
    squelchTail: function () {
      try {
        const ctx = initAudioGraph();
        const bufferSize = ctx.sampleRate * 0.06;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.055);

        noise.connect(gain);
        gain.connect(masterFilter);

        noise.start();
      } catch (e) {}
    },

    /**
     * Terminal Error Buzz (Low 110Hz square wave)
     */
    buzz: function () {
      try {
        const ctx = initAudioGraph();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(95, ctx.currentTime);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(masterFilter);

        osc.start();
        osc.stop(ctx.currentTime + 0.19);
      } catch (e) {}
    },

    /**
     * System Chime / Milestone Unlocked
     */
    chime: function () {
      try {
        const ctx = initAudioGraph();
        [440, 554.37, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.28);

          osc.connect(gain);
          gain.connect(masterFilter);

          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
        });
      } catch (e) {}
    },

    // Legacy backwards-compatibility alias for key thuds
    click: function () {
      this.keyThud();
    },

    speak: function (text) {
      if (!voiceEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.65;
      utterance.rate = 1.0;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };
})();
