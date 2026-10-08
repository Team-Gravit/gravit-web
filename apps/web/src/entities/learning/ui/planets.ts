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

// 이름과 이미지를 한 표에서 관리해 새 챕터를 추가할 때 둘이 어긋나지 않게 한다.
const PLANETS: Record<number, { name: string; image: string }> = {
  1: { name: '수성', image: mercury },
  2: { name: '금성', image: venus },
  3: { name: '지구', image: earth },
  4: { name: '화성', image: mars },
  5: { name: '목성', image: jupiter },
  6: { name: '토성', image: saturn },
  7: { name: '천왕성', image: uranus },
  8: { name: '해왕성', image: neptune },
  9: { name: '태양', image: sun },
  10: { name: '명왕성', image: pluto },
  11: { name: '세레스', image: ceres },
  12: { name: '에리스', image: eris },
  13: { name: '베스타', image: vesta },
  14: { name: '이오', image: io },
  15: { name: '유로파', image: europa },
  16: { name: '타이탄', image: titan },
  17: { name: '트리톤', image: triton },
  18: { name: '카론', image: charon },
  19: { name: '포보스', image: phobos },
  20: { name: '데이모스', image: deimos },
  21: { name: '미마스', image: mimas },
  22: { name: '레아', image: rhea },
  23: { name: '테티스', image: tethys },
  24: { name: '디오네', image: dione },
  25: { name: '오베론', image: oberon },
};

export function getPlanetImage(chapterId: number): string | undefined {
  return PLANETS[chapterId]?.image;
}

export function getPlanetName(chapterId: number): string | undefined {
  return PLANETS[chapterId]?.name;
}
