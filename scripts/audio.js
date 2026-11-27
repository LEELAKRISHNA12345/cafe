/* ==========================================================================
   L'AURA CAFÉ — PROCEDURAL CAFE ATMOSPHERE SYNTHESIZER
   Web Audio API: Generates cozy vinyl warmth, gentle electric piano chords,
   and tranquil acoustic coffeehouse soundscape without any external audio files.
   ========================================================================== */

class CafeSoundscape {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.chordTimer = null;
    this.vinylGain = null;
    this.noiseNode = null;
    this.currentChordIndex = 0;

    // Harmonious Neo-Soul / Warm Coffeehouse Jazz chord progressions (Frequencies in Hz)
    // Chords: Dmaj9 -> C#m7 -> Bm9 -> Amaj7
    this.chords = [
      [146.83, 220.00, 277.18, 329.63, 440.00], // Dmaj9 (D3, A3, C#4, E4, A4)
      [138.59, 207.65, 277.18, 329.63, 415.30], // C#m7 (C#3, G#3, C#4, E4, G#4)
      [123.47, 185.00, 220.00, 277.18, 370.00], // Bm9 (B2, F#3, A3, C#4, F#4)
      [110.00, 164.81, 220.00, 277.18, 329.63]  // Amaj7 (A2, E3, A3, C#4, E4)
    ];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      this.setupVinylCrackle();
    }
  }

  setupVinylCrackle() {
    // Generate 4 seconds of subtle pink noise with sporadic crackle bursts
    const bufferSize = this.audioCtx.sampleRate * 3;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.04;
      b2 = 0.85 * b2 + white * 0.08;
      
      // Occasional subtle vinyl tick/dust pop
      let crackle = 0;
      if (Math.random() < 0.0012) {
        crackle = (Math.random() - 0.5) * 0.8;
      }
      output[i] = (b0 + b1 + b2) * 0.05 + crackle;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to give warm analog vinyl dust character
    const bandpass = this.audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200;
    bandpass.Q.value = 0.8;

    this.vinylGain = this.audioCtx.createGain();
    this.vinylGain.gain.value = 0.15;

    whiteNoise.connect(bandpass);
    bandpass.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);

    whiteNoise.start(0);
    this.noiseNode = whiteNoise;
  }

  playChord(notes, duration = 4.5) {
    if (!this.isPlaying || !this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      // Create oscillator with warm sine/triangle blend
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      // Slightly detune to give analog Rhodes / electric piano richness
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.4, now);

      // Warm lowpass filter to soften high frequencies
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + idx * 150, now);

      // Tremolo LFO for lush vibrato
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(3.5, now); // 3.5Hz gentle tremolo
      lfoGain.gain.setValueAtTime(0.015, now);
      lfo.connect(oscGain.gain);
      lfo.start(now);

      // Smooth piano-like ADSR Envelope
      const noteVolume = 0.038 / (notes.length * 0.6);
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(noteVolume, now + 0.35); // Slow soft attack
      oscGain.gain.exponentialRampToValueAtTime(noteVolume * 0.4, now + duration * 0.6); // Gentle decay
      oscGain.gain.linearRampToValueAtTime(0.0001, now + duration); // Release

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
      lfo.stop(now + duration + 0.1);
    });
  }

  startChordProgression() {
    const playNext = () => {
      if (!this.isPlaying) return;

      const currentChord = this.chords[this.currentChordIndex];
      this.playChord(currentChord, 4.2);

      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

      this.chordTimer = setTimeout(playNext, 4000);
    };

    playNext();
  }

  toggle() {
    this.init();

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) {
      // Fade out
      this.masterGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.8);
      setTimeout(() => {
        this.isPlaying = false;
        clearTimeout(this.chordTimer);
      }, 800);
      return false;
    } else {
      // Fade in
      this.isPlaying = true;
      this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.85, this.audioCtx.currentTime + 1.2);
      this.startChordProgression();
      return true;
    }
  }
}

// Global instance
window.cafeAudio = new CafeSoundscape();
