import { DIMENSION } from "../config";

export const firstDejong = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result += Math.pow(point, 2);
  });
  return result;
};

export const secondDejong = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result +=
      100 * Math.pow(Math.pow(point, 2) - 1, 2) + Math.pow(1 - point, 2);
  });
  return result;
};

export const schweffel = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result += -point * Math.sin(Math.sqrt(Math.abs(point)));
  });
  return result;
};

export const rastring = (point: Array<number>): number => {
  let result = 0;

  point.forEach((point) => {
    result += point * point - 10*Math.cos(2 * Math.PI * point);
  });
  return 10 * DIMENSION * result;
};