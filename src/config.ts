import {
  firstDejong,
  secondDejong,
  schweffel,
  rastring,
} from "./testFunctions";
import { TestFunction } from "./types";

export const CURRENT_TEST_FUNCTION: TestFunction = "rastring";

export const NUMBER_OF_PARTICLES = 50;
export const C1 = 2;
export const C2 = 2;
export const INERTIA_START = 0.9; //wstart
export const INERTIA_END = 0.4; //wend
export const DIMENSION = 10;
export const FES = 5000 * DIMENSION;
export const NUMBER_OF_LINES = 30; //max 30
export const DATA_POINT_STEP_SIZE = 1000; // would be too many data points, so let's take only every 1000th
export const BOUNDARIES: {
  [key in TestFunction]: { min: number; max: number };
} = {
  firstDejong: {
    min: -5,
    max: 5,
  },
  secondDejong: {
    min: -5,
    max: 5,
  },
  schweffel: { //10:30
    min: -500,
    max: 500,
  },
  rastring: {
    min: -5,
    max: 5,
  },
};

export const LINE_COLORS = [
  "#1bb699",
  "#6b2e5f",
  "#64820f",
  "#1c2715",
  "#21538e",
  "#89d534",
  "#d36647",
  "#7fb411",
  "#0023b8",
  "#3b8c2a",
  "#986b53",
  "#f50422",
  "#983f7a",
  "#ea24a3",
  "#79352c",
  "#521250",
  "#c79ed2",
  "#d6dd92",
  "#e33e52",
  "#b2be57",
  "#fa06ec",
  "#1bb699",
  "#6b2e5f",
  "#64820f",
  "#1c2712",
  "#9cb64a",
  "#996c48",
  "#9ab9b7",
  "#06e052",
  "#e3a481",
].slice(0, NUMBER_OF_LINES);

export const generateGraphXAxesIndexes = (numberOfIndexes: number) =>
  new Array(numberOfIndexes).fill(1).map((_, index) => index * DATA_POINT_STEP_SIZE || 1);

export const TEST_FUNCTIONS: {
  [key in TestFunction]: (point: Array<number>) => number;
} = {
  firstDejong,
  secondDejong,
  schweffel,
  rastring,
};
