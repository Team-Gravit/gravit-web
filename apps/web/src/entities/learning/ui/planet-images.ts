import earth from './assets/earth.webp';
import jupiter from './assets/jupiter.webp';
import mars from './assets/mars.webp';
import mercury from './assets/mercury.webp';
import neptune from './assets/neptune.webp';
import saturn from './assets/saturn.webp';
import uranus from './assets/uranus.webp';
import venus from './assets/venus.webp';

const PLANET_IMAGES: Record<number, string> = {
  1: mercury,
  2: venus,
  3: earth,
  4: mars,
  5: jupiter,
  6: saturn,
  7: uranus,
  8: neptune,
};

export function getPlanetImage(chapterId: number): string | undefined {
  return PLANET_IMAGES[chapterId];
}
