/**
 * C.I.P.H.E.R. Acoustic Core & Mechanical Sound Engine (v6.0)
 * Module 01: Cache Tales Architecture
 * 
 * Physically modeled mechanical switches, damped 12V relay coils, 
 * low-frequency chassis resonance, and warm analog acoustic feedback.
 * Engineered for prolonged listening comfort without ear fatigue.
 * Strictly adheres to Master Canon Section 3 and Section 5.1.
 */

const CipherAudio = (function () {
  let audioCtx = null;
  let masterGain = null;
  let warmFilter = null;
  let voiceEnabled = true;

  /**
   * Initializes or resumes the AudioContext with master warmth stage
   */
  function getContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      // Master output conditioning: soft high-cut filter rolls off harsh digital spikes
      warmFilter = audioCtx.createBiquadFilter();
      warmFilter.type = 'lowpass';
      warmFilter.frequency.setValueAtTime(2400, audioCtx.currentTime);
      warmFilter.Q.setValueAtTime(0.707, audioCtx.currentTime);

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      warmFilter.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Generates a brief, highly damped burst of warm filtered noise (simulates mechanical impact/air)
   */
  function createDampedImpulse(ctx, destination, duration = 0.02, cutoff = 1200) {
    const bufferSize = Math.max(256, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Decaying pink-weighted impulse
      const decay = Math.exp(-i / (bufferSize * 0.25));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
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
     * Subdued mechanical tactile key click (replaces harsh 1400Hz piezo chirp)
     * Models a weighted mechanical keyboard switch latching in a metal chassis.
     */
    click: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        // Subtle mechanical snick (low transient)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.022);

        oscGain.gain.setValueAtTime(0.18, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

        osc.connect(oscGain);
        oscGain.connect(warmFilter);

        osc.start(now);
        osc.stop(now + 0.025);

        // Micro chassis tap
        createDampedImpulse(ctx, warmFilter, 0.015, 800);
      } catch (e) {}
    },

    /**
     * Heavy terminal key-thud (heavy mechanical spacebar/chassis contact)
     */
    keyThud: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.045);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

        osc.connect(gain);
        gain.connect(warmFilter);

        osc.start(now);
        osc.stop(now + 0.05);

        createDampedImpulse(ctx, warmFilter, 0.028, 600);
      } catch (e) {}
    },

    /**
     * Muted teletype line chatter (soft mechanical rhythm, no digital buzz)
     */
    lineChatter: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;
        const count = 2; // Reduced density for comfortable background cadence

        for (let i = 0; i < count; i++) {
          const t = now + (i * 0.028);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          // Warm harmonic pitch cluster (240Hz - 380Hz)
          osc.frequency.setValueAtTime(240 + Math.random() * 120, t);
          osc.frequency.exponentialRampToValueAtTime(90, t + 0.018);

          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

          osc.connect(gain);
          gain.connect(warmFilter);

          osc.start(t);
          osc.stop(t + 0.022);
        }
      } catch (e) {}
    },

    /**
     * Tactile Rotary Ratchet Tooth Tick (warm gear pawl escapement)
     */
    wheelTick: function (isOuter = false) {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';

        // Organic low-mid gear frequencies (320Hz outer / 460Hz inner)
        const baseFreq = isOuter ? 320 : 460;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.35, now + 0.02);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

        osc.connect(gain);
        gain.connect(warmFilter);

        osc.start(now);
        osc.stop(now + 0.025);

        createDampedImpulse(ctx, warmFilter, 0.018, 900);
      } catch (e) {}
    },

    /**
     * Mechanical Lock Detent Snap (Dual-harmonic heavy latch closing)
     */
    wheelSlam: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        // Sub-bass physical latch impact
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(160, now);
        sub.frequency.exponentialRampToValueAtTime(40, now + 0.14);

        subGain.gain.setValueAtTime(0.5, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        sub.connect(subGain);
        subGain.connect(warmFilter);

        // Resonant lock body snap
        const body = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        body.type = 'triangle';
        body.frequency.setValueAtTime(480, now);
        body.frequency.exponentialRampToValueAtTime(95, now + 0.1);

        bodyGain.gain.setValueAtTime(0.25, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        body.connect(bodyGain);
        bodyGain.connect(warmFilter);

        sub.start(now);
        body.start(now);
        sub.stop(now + 0.16);
        body.stop(now + 0.16);

        createDampedImpulse(ctx, warmFilter, 0.06, 750);
      } catch (e) {}
    },

    /**
     * 12V Industrial Relay Step (satisfying mechanical solenoid clack)
     */
    relay: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        // Coil energize snap (magnetic coil pull)
        const coil = ctx.createOscillator();
        const coilGain = ctx.createGain();
        coil.type = 'triangle';
        coil.frequency.setValueAtTime(180, now);
        coil.frequency.exponentialRampToValueAtTime(65, now + 0.045);

        coilGain.gain.setValueAtTime(0.35, now);
        coilGain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

        coil.connect(coilGain);
        coilGain.connect(warmFilter);

        coil.start(now);
        coil.stop(now + 0.05);

        // Contact closure bounce (soft snick at 18ms)
        const bounce = ctx.createOscillator();
        const bounceGain = ctx.createGain();
        bounce.type = 'sine';
        bounce.frequency.setValueAtTime(620, now + 0.016);
        bounce.frequency.exponentialRampToValueAtTime(180, now + 0.038);

        bounceGain.gain.setValueAtTime(0.18, now + 0.016);
        bounceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        bounce.connect(bounceGain);
        bounceGain.connect(warmFilter);

        bounce.start(now + 0.016);
        bounce.stop(now + 0.042);

        createDampedImpulse(ctx, warmFilter, 0.025, 1100);
      } catch (e) {}
    },

    /**
     * Percussive Maintenance: 1/4-inch welded steel casing clank
     * Resonant, heavy metal strike with deep low-end shelf and zero harsh high sibilance.
     */
    clank: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        // Heavy steel mass fundamental
        const mass = ctx.createOscillator();
        const massGain = ctx.createGain();
        mass.type = 'triangle';
        mass.frequency.setValueAtTime(85, now);
        mass.frequency.exponentialRampToValueAtTime(32, now + 0.28);

        massGain.gain.setValueAtTime(0.65, now);
        massGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        mass.connect(massGain);
        massGain.connect(warmFilter);

        // Steel enclosure resonant harmonics (damped room resonance)
        const ring = ctx.createOscillator();
        const ringGain = ctx.createGain();
        ring.type = 'sine';
        ring.frequency.setValueAtTime(340, now);
        ring.frequency.exponentialRampToValueAtTime(190, now + 0.22);

        ringGain.gain.setValueAtTime(0.22, now);
        ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        ring.connect(ringGain);
        ringGain.connect(warmFilter);

        mass.start(now);
        ring.start(now);
        mass.stop(now + 0.32);
        ring.stop(now + 0.32);

        createDampedImpulse(ctx, warmFilter, 0.08, 650);
      } catch (e) {}
    },

    /**
     * Line error / brownout: warm 60Hz/120Hz transformer hum (replaces harsh 110Hz sawtooth)
     */
    buzz: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        const fundamental = ctx.createOscillator();
        const fGain = ctx.createGain();
        fundamental.type = 'triangle';
        fundamental.frequency.setValueAtTime(60, now); // Authentic 60Hz transformer mains
        fundamental.frequency.linearRampToValueAtTime(58, now + 0.22);

        fGain.gain.setValueAtTime(0.3, now);
        fGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        const harmonic = ctx.createOscillator();
        const hGain = ctx.createGain();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(120, now); // 2nd harmonic hum
        hGain.gain.setValueAtTime(0.15, now);
        hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        fundamental.connect(fGain);
        harmonic.connect(hGain);
        fGain.connect(warmFilter);
        hGain.connect(warmFilter);

        fundamental.start(now);
        harmonic.start(now);
        fundamental.stop(now + 0.25);
        harmonic.stop(now + 0.25);
      } catch (e) {}
    },

    /**
     * Warm, musical minor/major chord progression for sector restoration & achievements
     */
    chime: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;
        // Warm C-major triad (E4, G4, C5, E5) with gentle envelope
        const chords = [329.63, 392.00, 523.25, 659.25];

        chords.forEach((freq, i) => {
          const t = now + (i * 0.065);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.32);

          osc.connect(gain);
          gain.connect(warmFilter);

          osc.start(t);
          osc.stop(t + 0.34);
        });
      } catch (e) {}
    },

    /**
     * Analog radio squelch tail (soft filtered pink-noise breath, no white-noise hiss)
     */
    squelchTail: function () {
      try {
        const ctx = getContext();
        createDampedImpulse(ctx, warmFilter, 0.07, 700);
      } catch (e) {}
    },

    /**
     * Push-to-talk mic click (soft mechanical switch snap)
     */
    micClick: function () {
      try {
        const ctx = getContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.03);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(warmFilter);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    },

    /**
     * Web Speech API integration with balanced, non-robotic rate & pitch
     */
    speak: function (text) {
      if (!voiceEnabled || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.85; // Slightly grounded tone
        utterance.rate = 1.0;   // Natural pacing
        utterance.volume = 0.75;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };
})();

// Attach to window object for global module accessibility
window.CipherAudio = CipherAudio;
