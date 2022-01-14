import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Particle = {
  pBest: number;
  pBestPosition: Array<number> | null;
  position: Array<number>; // D = 10 || 30;
  velocityVector: Array<number>;
};

type Boundaries = {
  min: number;
  max: number;
};

const NUMBER_OF_PARTICLES = 50;
const C1 = 2;
const C2 = 2;
const INERTIA_START = 0.9; //wstart
const INERTIA_END = 0.4; //wend
const DIMENSION = 2;
const FES = 5000 * DIMENSION;

type TestFunction = "firstDejong" | "secondDejong" | "schweffel" | "rastring";

const CURRENT_TEST_FUNCTION: TestFunction = "rastring";

const firstDejong = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result += Math.pow(point, 2);
  });
  return result;
};

const secondDejong = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result +=
      100 * Math.pow(Math.pow(point, 2) - 1, 2) + Math.pow(1 - point, 2);
  });
  return result;
};

const schweffel = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result += -point * Math.sin(Math.sqrt(Math.abs(point)));
  });
  return result;
};

const rastring = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result += point * point - 10*Math.cos(2 * Math.PI * point);
  });
  return 10 * DIMENSION * result;
};

const BOUNDARIES: { [key in TestFunction]: { min: number; max: number } } = {
  firstDejong: {
    min: -5,
    max: 5,
  },
  secondDejong: {
    min: -5,
    max: 5,
  },
  schweffel: {
    min: -500,
    max: 500,
  },
  rastring: {
    min: -5,
    max: 5,
  },
};

const TEST_FUNCTIONS: {
  [key in TestFunction]: (point: Array<number>) => number;
} = {
  firstDejong,
  secondDejong,
  schweffel,
  rastring,
};

const COLORS = [
  "#1bb699",
  "#6b2e5f",
  // "#64820f",
  // "#1c2715",
  // "#21538e",
  // "#89d534",
  // "#d36647",
  // "#7fb411",
  // "#0023b8",
  // "#3b8c2a",
  // "#986b53",
  // "#f50422",
  // "#983f7a",
  // "#ea24a3",
  // "#79352c",
  // "#521250",
  // "#c79ed2",
  // "#d6dd92",
  // "#e33e52",
  // "#b2be57",
  // "#fa06ec",
  // "#1bb699",
  // "#6b2e5f",
  // "#64820f",
  // "#1c2712",
  // "#9cb64a",
  // "#996c48",
  // "#9ab9b7",
  // "#06e052",
  // "#e3a481",
];

const generateRandomParticle = (
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

const generateParticles = (
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

const getNewVelocityVector = (
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

const getDataset = (particles: Array<Particle>, color: string): Dataset => {
  let globalBest = Infinity;
  let globalBestPosition = null;
  let globalBestHistory = [];
  let inertiaWeight: number = 0;
  let finalIteration = FES;
  const labels = [];

  for (let i = 0; i < FES; i++) {
    inertiaWeight =
      //(((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
      ((FES - i - 0) * (INERTIA_START - INERTIA_END)) / (FES - 0) + INERTIA_END;

    for (let j = 0; j < particles.length; j++) {
      const particle = particles[j];
      const result = TEST_FUNCTIONS[CURRENT_TEST_FUNCTION](particle.position);

      if (result < particle.pBest) {
        particle.pBest = result;
        particle.pBestPosition = particle.position;
        if (result < globalBest) {
          globalBest = result;
          globalBestPosition = particle.position;
        }
      }

      particle.velocityVector = getNewVelocityVector(
        particle,
        globalBestPosition,
        inertiaWeight
      );

      particle.position = particle.position.map((dimension, index) => {
        const newPosition = dimension + particle.velocityVector[index];
        return newPosition < BOUNDARIES[CURRENT_TEST_FUNCTION].min
          ? Math.random() *
              (BOUNDARIES[CURRENT_TEST_FUNCTION].max -
                BOUNDARIES[CURRENT_TEST_FUNCTION].min) +
              BOUNDARIES[CURRENT_TEST_FUNCTION].min
          : newPosition > BOUNDARIES[CURRENT_TEST_FUNCTION].max
          ? Math.random() *
              (BOUNDARIES[CURRENT_TEST_FUNCTION].max -
                BOUNDARIES[CURRENT_TEST_FUNCTION].min) +
            BOUNDARIES[CURRENT_TEST_FUNCTION].min
          : newPosition;
      });
    }
    if (i % 1000 === 0) {
      labels.push(i);
      globalBestHistory.push(globalBest);
    }
    if (globalBest === 0) {
      finalIteration = i;
      break;
    }
  }

  return {
    label:
      "Global best: " +
      globalBest +
      " done in " +
      finalIteration +
      " iterations",
    data: globalBestHistory,
    borderColor: color,
    // backgroundColor: "rgba(255, 99, 132, 1)",
    labels,
  };
};

type Dataset = {
  label: string;
  data: number[];
  borderColor: string;
  labels: Array<number>;
};

export function Magic() {
  const datasets: Array<Dataset> = COLORS.map((color) =>
    getDataset(
      generateParticles(
        NUMBER_OF_PARTICLES,
        BOUNDARIES[CURRENT_TEST_FUNCTION],
        DIMENSION
      ),
      color
    )
  );

  // Statistical data --------------------------------------------------
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
  const mean = sum / 30;

  const variation =
    arrayOfTheFinalResults.reduce((accumulator, result) => {
      return accumulator + (result - mean) * (result - mean);
    }, 0) / arrayOfTheFinalResults.length; // 30?
  const deviation = Math.sqrt(variation);

  const getMedian = (arr: Array<number>) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  const median = getMedian(arrayOfTheFinalResults);
  // End of Statistical data --------------------------------------------------

  const data = {
    labels: datasets[0].labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: TEST_FUNCTIONS[CURRENT_TEST_FUNCTION].name,
      },
    },
  };

  return (
    <>
      <table style={{ marginBottom: "25px" }}>
        <tbody>
          <tr>
            <td>Best</td>
            <td>{best}</td>
          </tr>
          <tr>
            <td>Worst</td>
            <td>{worst}</td>
          </tr>
          <tr>
            <td>Median</td>
            <td>{median}</td>
          </tr>
          <tr>
            <td>Deviation</td>
            <td>{deviation}</td>
          </tr>
          <tr>
            <td>Mean</td>
            <td>{mean}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ backgroundColor: "white" }}>
        <Line options={options} data={data} />;
      </div>
    </>
  );
}
