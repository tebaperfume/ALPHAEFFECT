export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  genre: string;
  bpm: number;
  lyrics: { time: number; text: string }[];
  energy: number;
  frequencyData?: number[]; // Mock visualizer values when playing
}

export type VisualizerMode = "quantum_pulse" | "nebula_fluid" | "hyperdrive" | "soundwave";

export interface EqualizerBand {
  frequency: string;
  value: number; // -12 to +12 dB
}

export interface SoundEngineState {
  spatialAudio: boolean;
  alphaBoost: boolean;
  bassOverdrive: boolean;
  reverb: number; // 0 to 100
  equalizer: EqualizerBand[];
}
