export interface BackgroundDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export const dotsStore = {
  dots: [] as BackgroundDot[],
  initialized: false,
  init(width: number, height: number) {
    if (this.initialized && this.dots.length > 0) return;
    const count = Math.min(80, Math.max(40, Math.floor((width * height) / 18000)));
    const newDots: BackgroundDot[] = [];
    for (let i = 0; i < count; i++) {
      newDots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.5 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.35,
      });
    }
    this.dots = newDots;
    this.initialized = true;
  },
  removeDot(index: number) {
    if (index >= 0 && index < this.dots.length) {
      this.dots.splice(index, 1);
    }
  },
};
