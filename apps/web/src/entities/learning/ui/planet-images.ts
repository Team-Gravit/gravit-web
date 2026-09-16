import mercury from './assets/planet-01-mercury.webp';
import venus from './assets/planet-02-venus.webp';
import earth from './assets/planet-03-earth.webp';
import mars from './assets/planet-04-mars.webp';
import jupiter from './assets/planet-05-jupiter.webp';
import saturn from './assets/planet-06-saturn.webp';
import uranus from './assets/planet-07-uranus.webp';
import neptune from './assets/planet-08-neptune.webp';
import sun from './assets/planet-09-sun.png';
import pluto from './assets/planet-10-pluto.png';
import ceres from './assets/planet-11-ceres.png';
import eris from './assets/planet-12-eris.png';
import vesta from './assets/planet-13-vesta.png';
import io from './assets/planet-14-io.png';
import europa from './assets/planet-15-europa.png';
import titan from './assets/planet-16-titan.png';
import triton from './assets/planet-17-triton.png';
import charon from './assets/planet-18-charon.png';
import phobos from './assets/planet-19-phobos.png';
import deimos from './assets/planet-20-deimos.png';
import mimas from './assets/planet-21-mimas.png';
import rhea from './assets/planet-22-rhea.png';
import tethys from './assets/planet-23-tethys.png';
import dione from './assets/planet-24-dione.png';
import oberon from './assets/planet-25-oberon.png';

const PLANET_IMAGES: Record<number, string> = {
  1: mercury,
  2: venus,
  3: earth,
  4: mars,
  5: jupiter,
  6: saturn,
  7: uranus,
  8: neptune,
  9: sun,
  10: pluto,
  11: ceres,
  12: eris,
  13: vesta,
  14: io,
  15: europa,
  16: titan,
  17: triton,
  18: charon,
  19: phobos,
  20: deimos,
  21: mimas,
  22: rhea,
  23: tethys,
  24: dione,
  25: oberon,
};

export function getPlanetImage(chapterId: number): string | undefined {
  return PLANET_IMAGES[chapterId];
}
