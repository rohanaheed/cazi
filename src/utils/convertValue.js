import insertComma from "./insertComma";


export function convertLgNum (labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

  ? insertComma((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2), true) + "B"
  // Six Zeroes for Millions 
  : Math.abs(Number(labelValue)) >= 1.0e+6

  ? insertComma((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2), true) + "M"
  // Three Zeroes for Thousands
  : Math.abs(Number(labelValue)) >= 1.0e+3

  ? insertComma((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2), true) + "K"

  : Math.abs(Number(labelValue));
}
