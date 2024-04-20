export function convertInputToString(d) {
  const dp = d.split("-");
  return dp.reverse().join(".");
}
