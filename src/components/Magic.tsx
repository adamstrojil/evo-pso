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
const DIMENSION = 1;
const FES = 5000 * DIMENSION;

const TEST_FUNCTION = "deJong";
const BOUNDARIES = {
  deJong: {
    min: -5,
    max: 5,
  },
  schweffel: {
    min: -500,
    max: 500,
  },
};

const COLORS = [
  "#1bb699",
  "#6b2e5f",
  "#64820f",
  "#1c2715",
  "#21538e",
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
    pBest: 200, //TODO fix
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
  gBest: number,
  weight = INERTIA_START,
  c1 = C1,
  c2 = C2
): Array<number> =>
  particle.position.map((dimension, index) => {
    return (
      weight * particle.velocityVector[index] +
      c1 * Math.random() * (particle.pBest - dimension) +
      c2 * Math.random() * (gBest - dimension)
    );
  });

const getDataset = (particles: Array<Particle>, color: string) => {
  let globalBest = Infinity;
  let globalBestHistory = [];

  for (let i = 0; i < FES; i++) {
    for (const particle of particles) {
      const result = firstDejong(particle.position);

      if (result < particle.pBest) {
        particle.pBest = result;
        if (result < globalBest) {
          globalBest = result;
          // globalBestHistory.push(globalBest)
        }
      }

      particle.velocityVector = getNewVelocityVector(particle, globalBest);
      
      particle.position.map((dimension, index) => {
        const newPosition = dimension + particle.velocityVector[index];
        return newPosition < BOUNDARIES.deJong.min
          ? BOUNDARIES.deJong.min
          : newPosition > BOUNDARIES.deJong.max
          ? BOUNDARIES.deJong.max
          : newPosition;
      });
    }
    (i < 100 || i % 1000 === 1111) && globalBestHistory.push(globalBest);
  }
  return {
    label: "Global best: " + globalBest,
    data: globalBestHistory,
    borderColor: color,
    // backgroundColor: "rgba(255, 99, 132, 1)",
  };
};

export function Magic() {
  // let globalBest = Infinity; //TODO fix initial
  // const globalBestHistory: number[] = [];

  // const particles: Array<Particle> = generateParticles(
  //   NUMBER_OF_PARTICLES,
  //   BOUNDARIES[TEST_FUNCTION],
  //   DIMENSION
  // );

  // const testParticle = {
  //   pBest: 200,
  //   position: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //   velocityVector: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // };
  // console.log("particle: ", testParticle);
  // console.log("vector: ", getNewVelocityVector(testParticle, globalBest));
  // printParticles(particles);

  const datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
  }> = [];

  COLORS.map((color) =>
    datasets.push(
      getDataset(
        generateParticles(
          NUMBER_OF_PARTICLES,
          BOUNDARIES[TEST_FUNCTION],
          DIMENSION
        ),
        color
      )
    )
  );

  const data = {
    labels: datasets[0].data.map((_, index) => index),
    datasets: datasets,
  };

  const options = {
    responsive: true,
    // color: "white",
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "later",
      },
    },
  };

  return <Line options={options} data={data} />;
}
