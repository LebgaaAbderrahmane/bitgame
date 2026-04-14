class SoundManager {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private musicVolume: GainNode | null = null;
  private isMuted: boolean = false;
  private ambientOsc: OscillatorNode | null = null;

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.connect(this.ctx.destination);
    this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime);
    
    this.musicVolume = this.ctx.createGain();
    this.musicVolume.connect(this.masterVolume);
    this.musicVolume.gain.setValueAtTime(0.2, this.ctx.currentTime);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.5) {
    if (!this.ctx || !this.masterVolume || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playMove() {
    this.init();
    this.playTone(440, 'square', 0.1, 0.2);
  }

  public playTurn() {
    this.init();
    this.playTone(220, 'sine', 0.1, 0.3);
  }

  public playCollect() {
    this.init();
    this.playTone(880, 'triangle', 0.2, 0.4);
    setTimeout(() => this.playTone(1320, 'triangle', 0.3, 0.4), 50);
  }

  public playHitWall() {
    this.init();
    this.playTone(100, 'sawtooth', 0.4, 0.5);
    this.playTone(50, 'square', 0.2, 0.5);
  }

  public playSuccess() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sine', 0.4, 0.4), i * 150);
    });
  }

  public playFail() {
    this.init();
    this.playTone(200, 'sawtooth', 0.5, 0.4);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.6, 0.4), 200);
  }

  public startMusic() {
    this.init();
    if (this.ambientOsc || !this.ctx || !this.musicVolume) return;
    
    this.ambientOsc = this.ctx.createOscillator();
    this.ambientOsc.type = 'sine';
    this.ambientOsc.frequency.setValueAtTime(110, this.ctx.currentTime); // Low A
    
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.5, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(5, this.ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientOsc.frequency);
    
    this.ambientOsc.connect(this.musicVolume);
    lfo.start();
    this.ambientOsc.start();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterVolume) {
      this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx?.currentTime || 0);
    }
  }
}

export const sounds = new SoundManager();
