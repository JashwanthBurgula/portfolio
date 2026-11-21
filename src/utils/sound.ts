// Lightweight Web Audio API Sound Synthesizer (Zero external audio files required)

class SoundFX {
  private ctx: AudioContext | null = null
  private enabled: boolean = false

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public toggle(): boolean {
    this.init()
    this.enabled = !this.enabled
    if (this.enabled) {
      this.playBeep(520, 0.05, 'sine', 0.1)
    }
    return this.enabled
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  // Subtle futuristic micro-click on button/link hover
  public playHover() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {
      // Ignore audio failure
    }
  }

  // Tactile click on button press
  public playClick() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.06)
    } catch {
      // Ignore
    }
  }

  // Mechanical pull-string lamp click (snap-clack)
  public playLampClick() {
    this.init()
    if (!this.ctx) return

    try {
      // First click
      const osc1 = this.ctx.createOscillator()
      const gain1 = this.ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(520, this.ctx.currentTime)
      osc1.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04)
      gain1.gain.setValueAtTime(0.18, this.ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04)
      osc1.connect(gain1)
      gain1.connect(this.ctx.destination)
      osc1.start()
      osc1.stop(this.ctx.currentTime + 0.04)

      // Second mechanical snap
      const osc2 = this.ctx.createOscillator()
      const gain2 = this.ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(880, this.ctx.currentTime + 0.035)
      osc2.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.08)
      gain2.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.035)
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)
      osc2.connect(gain2)
      gain2.connect(this.ctx.destination)
      osc2.start(this.ctx.currentTime + 0.035)
      osc2.stop(this.ctx.currentTime + 0.08)
    } catch {
      // Ignore
    }
  }

  // Retro arcade blip for brick collision
  public playBrickHit(frequency: number = 440) {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.ctx.currentTime + 0.05)

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.05)
    } catch {
      // Ignore
    }
  }

  // Resonant low-frequency chord when entering a 3D world
  public playPortalWarp() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    try {
      const freqs = [110, 164.81, 220, 329.63]
      freqs.forEach((freq) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start()
        osc.stop(this.ctx.currentTime + 0.8)
      })
    } catch {
      // Ignore
    }
  }

  private playBeep(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.05) {
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(volume, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundFX()
