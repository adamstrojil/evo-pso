import React from "react";

import { Line } from "react-chartjs-2";

import { Dataset, Particle } from "../types";
import {
  BOUNDARIES,
  LINE_COLORS,
  CURRENT_TEST_FUNCTION,
  DIMENSION,
  FES,
  INERTIA_END,
  INERTIA_START,
  NUMBER_OF_PARTICLES,
  TEST_FUNCTIONS,
  DATA_POINT_STEP_SIZE,
  generateGraphXAxesIndexes,
  C1,
} from "../config";
import {
  generateParticles,
  getNewVelocityVector,
  getStatisticalData,
  positionOrRandomIfOutOfBorders,
} from "../utils";

const pso = (particles: Array<Particle>, color: string): Dataset => {
  let globalBest = Infinity;
  let globalBestPosition = null;
  let globalBestHistory = [];
  let inertiaWeight = 0;

  for (let i = 0; i < FES; i++) {
    inertiaWeight =
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
        return positionOrRandomIfOutOfBorders(newPosition);
      });
    }
    if (i % DATA_POINT_STEP_SIZE === 0) {
      // would be too many data points, so let's take every 1000th
      globalBestHistory.push(globalBest);
    }
  }

  return {
    label: "Global best: " + globalBest,
    data: globalBestHistory,
    borderColor: color,
  };
};

const graphOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    // title: {
    //   display: true,
    //   text: TEST_FUNCTIONS[CURRENT_TEST_FUNCTION].name,
    // },
  },
};

const datasets: Array<Dataset> = LINE_COLORS.map((color) =>
  pso(
    generateParticles(
      NUMBER_OF_PARTICLES,
      BOUNDARIES[CURRENT_TEST_FUNCTION],
      DIMENSION
    ),
    color
  )
);

const { best, worst, median, deviation, mean } = getStatisticalData(datasets);

const graphData = {
  labels: generateGraphXAxesIndexes(datasets[0].data.length), //taking the first one, doesn't matter
  datasets,
};

export function Main() {
  return (
    <div style={{ margin: " 0 10vw 10vh 10vw" }}>
      <h2 style={{textAlign: "center" }}>
        {CURRENT_TEST_FUNCTION[0].toUpperCase() +
          CURRENT_TEST_FUNCTION.slice(1)}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "25px",
          justifyContent: "space-between",
        }}
      >
        <table style={{ textAlign: "left" }}>
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
        <table style={{ textAlign: "left" }}>
          <tbody>
            <tr>
              <td>Nunber of Particles</td>
              <td>{NUMBER_OF_PARTICLES}</td>
            </tr>
            <tr>
              <td>Dimension</td>
              <td>{DIMENSION}</td>
            </tr>
            <tr>
              <td>FES</td>
              <td>{FES}</td>
            </tr>
            <tr>
              <td>Inertia start</td>
              <td>{INERTIA_START}</td>
            </tr>
            <tr>
              <td>Inertia end</td>
              <td>{INERTIA_END}</td>
            </tr>
            <tr>
              <td>Inertia end</td>
              <td>{INERTIA_END}</td>
            </tr>
            <tr>
              <td>c1 and c2</td>
              <td>{C1}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ backgroundColor: "white" }}>
        <Line options={graphOptions} data={graphData} />;
      </div>
    </div>
  );
}
