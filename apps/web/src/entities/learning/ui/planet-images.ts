import mercury from './assets/planet-01-mercury.webp';
import venus from './assets/planet-02-venus.webp';
import earth from './assets/planet-03-earth.webp';
import mars from './assets/planet-04-mars.webp';
import jupiter from './assets/planet-05-jupiter.webp';
import saturn from './assets/planet-06-saturn.webp';
import uranus from './assets/planet-07-uranus.webp';
import neptune from './assets/planet-08-neptune.webp';
import sun from './assets/planet-09-sun.webp';
import pluto from './assets/planet-10-pluto.webp';
import ceres from './assets/planet-11-ceres.webp';
import eris from './assets/planet-12-eris.webp';
import vesta from './assets/planet-13-vesta.webp';
import io from './assets/planet-14-io.webp';
import europa from './assets/planet-15-europa.webp';
import titan from './assets/planet-16-titan.webp';
import triton from './assets/planet-17-triton.webp';
import charon from './assets/planet-18-charon.webp';
import phobos from './assets/planet-19-phobos.webp';
import deimos from './assets/planet-20-deimos.webp';
import mimas from './assets/planet-21-mimas.webp';
import rhea from './assets/planet-22-rhea.webp';
import tethys from './assets/planet-23-tethys.webp';
import dione from './assets/planet-24-dione.webp';
import oberon from './assets/planet-25-oberon.webp';

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
