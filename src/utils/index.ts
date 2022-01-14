import {
  BOUNDARIES,
  C1,
  C2,
  CURRENT_TEST_FUNCTION,
  INERTIA_START,
  NUMBER_OF_LINES,
} from "../config";
import { Boundaries, Dataset, Particle } from "../types";

export const generateRandomParticle = (
  { max, min }: Boundaries,
  dimension: number
): Particle => {
  let position = [];
  let counter = 0;
  while (counter < dimension) {
    counter++;
    position.push(Math.random() * (max - min) + min);
  }

  return {
    position,
    pBest: Infinity,
    pBestPosition: null,
    velocityVector: new Array(dimension).fill(0),
  };
};

export const generateParticles = (
  count: number,
  boundaries: Boundaries,
  particleDimension: number
): Array<Particle> => {
  let particles: Array<Particle> = [];
  let counter = 0;
  while (counter < count) {
    counter++;
    particles.push(generateRandomParticle(boundaries, particleDimension));
  }
  return particles;
};

export const getNewVelocityVector = (
  particle: Particle,
  gBestPosition: Array<number> | null,
  intertiaWeight = INERTIA_START,
  c1 = C1,
  c2 = C2
): Array<number> =>
  particle.position.map((coordinate, dimensionIndex) => {
    return (
      intertiaWeight * particle.velocityVector[dimensionIndex] +
      c1 *
        Math.random() *
        ((particle.pBestPosition?.[dimensionIndex] || coordinate) -
          coordinate) +
      c2 *
        Math.random() *
        ((gBestPosition?.[dimensionIndex] || coordinate) - coordinate)
    );
  });

export const getMedian = (arr: Array<number>) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export const positionOrRandomIfOutOfBorders = (position: number) => {
  return position < BOUNDARIES[CURRENT_TEST_FUNCTION].min
    ? Math.random() *
        (BOUNDARIES[CURRENT_TEST_FUNCTION].max -
          BOUNDARIES[CURRENT_TEST_FUNCTION].min) +
        BOUNDARIES[CURRENT_TEST_FUNCTION].min
    : position > BOUNDARIES[CURRENT_TEST_FUNCTION].max
    ? Math.random() *
        (BOUNDARIES[CURRENT_TEST_FUNCTION].max -
          BOUNDARIES[CURRENT_TEST_FUNCTION].min) +
      BOUNDARIES[CURRENT_TEST_FUNCTION].min
    : position;
};

// Statistical data --------------------------------------------------
export const getStatisticalData = (
  datasets: Array<Dataset>
): {
  best: number;
  worst: number;
  median: number;
  deviation: number;
  mean: number;
} => {
  let sum = 0;
  let worst = -Infinity;
  let best = Infinity;
  let arrayOfTheFinalResults: Array<number> = [];
  datasets.forEach((dataset) => {
    const lastResult = dataset.data[dataset.data.length - 1];
    arrayOfTheFinalResults.push(lastResult);
    sum += lastResult;
    worst = lastResult > worst ? lastResult : worst;
    best = lastResult < best ? lastResult : best;
  });
  const mean = sum / NUMBER_OF_LINES;

  const variation =
    arrayOfTheFinalResults.reduce((accumulator, result) => {
      return accumulator + (result - mean) * (result - mean);
    }, 0) / arrayOfTheFinalResults.length; // 30?
  const deviation = Math.sqrt(variation);
  const median = getMedian(arrayOfTheFinalResults);

  return {
    best,
    worst,
    median,
    deviation,
    mean,
  };
};
// End of Statistical data --------------------------------------------------
