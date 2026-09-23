// Seeded Pseudo-Random Number Generator (Mulberry32)
// Provides reproducible pseudo-random numbers given an integer seed.

export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
    // Warm up the generator
    this.next();
    this.next();
  }

  // Generates a floating point number in [0, 1)
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Alias for next() returning float in [0, 1)
  nextFloat(): number {
    return this.next();
  }

  // Generates an integer in [min, max] inclusive
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Shuffles an array in place using Fisher-Yates
  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // Pick random element
  choice<T>(array: T[]): T {
    const idx = Math.floor(this.next() * array.length);
    return array[idx];
  }
}

export const Mulberry32 = SeededRandom;
export type Mulberry32 = SeededRandom;
