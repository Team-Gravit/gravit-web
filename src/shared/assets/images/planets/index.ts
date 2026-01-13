import activeAsteroidImg from "./active-asteroid.png";
import earthImg from "./Earth.png";
import inactiveAsteroidImg from "./inactive-asteroid.png";
import jupiterImg from "./Jupiter.png";
import marsImg from "./Mars.png";
import mercuryImg from "./Mercury.png";
import neptuneImg from "./Neptune.png";
import saturnImg from "./Saturn.png";
import uranusImg from "./Uranus.png";
import venusImg from "./Venus.png";

export const PLANET_IMAGES = {
	1: mercuryImg,
	2: venusImg,
	3: earthImg,
	4: marsImg,
	5: jupiterImg,
	6: saturnImg,
	7: uranusImg,
	8: neptuneImg,
} as const;

export const ASTEROID_IMAGES = {
	unlocked: activeAsteroidImg,
	locked: inactiveAsteroidImg,
};
