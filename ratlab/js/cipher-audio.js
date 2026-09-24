/**
 * C.I.P.H.E.R. Acoustic Core & Chassis Sound Synthesizer (v4.5 - Speech Fix)
 */
const CipherAudio = (function () {
  let audioCtx = null;
  let masterFilter = null;
  let masterGain = null;
  let voiceEnabled = true;

  // Prevent Mobile Chrome GC bug by holding reference globally
  window.__cipher_active_utterance = null;
  let speechQueue = [];
  let isSpeaking = false;

  function initAudioGraph() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterFilter = audioCtx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(750, audioCtx.currentTime);
      masterFilter.Q.setValueAtTime(1.2, audioCtx.currentTime);

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

  function processSpeechQueue() {
    if (speechQueue.length === 0 || !voiceEnabled || !window.speechSynthesis) {
      isSpeaking = false;
      window.__cipher_active_utterance = null;
      return;
    }

    isSpeaking = true;
    const textChunk = speechQueue.shift();
    const utterance = new SpeechSynthesisUtterance(textChunk);
    
    // Hold reference on window to block garbage collection
    window.__cipher_active_utterance = utterance;

    utterance.pitch = 0.68;
    utterance.rate = 1.0;
    utterance.volume = 0.9;

    utterance.onend = () => {
      // Process next sentence chunk
      processSpeechQueue();
    };

    utterance.onerror = (e) => {
      console.warn('CipherAudio: Speech chunk error', e);
      processSpeechQueue();
    };

    window.speechSynthesis.speak(utterance);
  }

  return {
    isVoiceEnabled: function () {
      return voiceEnabled;
    },

    toggleVoice: function () {
      voiceEnabled = !voiceEnabled;
      if (!voiceEnabled && window.speechSynthesis) {
        speechQueue = [];
        window.speechSynthesis.cancel();
      }
      return voiceEnabled;
    },

    unlock: function () {
      initAudioGraph();
    },

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

    transformerHum: function (duration = 0.6, sag = false) {
      try {
        const ctx = initAudioGraph();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        const baseFreq = 60;
        osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

        if (sag) {
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

    click: function () {
      this.keyThud();
    },

    /**
     * Chunked, GC-Safe Speech Synthesizer
     * Breaks text into sentences and queues them cleanly so mobile browsers won't cut off.
     */
    speak: function (fullText) {
      if (!voiceEnabled || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      speechQueue = [];

      // Split into clean sentence-level chunks
      const sentences = fullText
        .replace(/([.?!])\s*(?=[A-Z0-9])/g, "$1|")
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      speechQueue = sentences;
      processSpeechQueue();
    }
  };
})();
