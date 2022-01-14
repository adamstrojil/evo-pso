export type Particle = {
  pBest: number;
  pBestPosition: Array<number> | null;
  position: Array<number>; // D = 10 || 30;
  velocityVector: Array<number>;
};

export type Boundaries = {
  min: number;
  max: number;
};

export type TestFunction =
  | "firstDejong"
  | "secondDejong"
  | "schweffel"
  | "rastring";

export type Dataset = {
  label: string;
  data: number[];
  borderColor: string;
  // labels: Array<number>;
};
