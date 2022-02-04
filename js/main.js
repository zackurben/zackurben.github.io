'use strict';

/**
 * Get the total time of exp from the given start time to now. Used for skills currently in use.
 *
 * @param start {Number}
 *   The time this skill was acquired.
 * @param stop {Number} optional
 *   The time this skill was no longer being used (EPOCH in ms).
 *
 * @returns {Number}
 *   The time in years.
 */
const since = (start, stop) => {
  const time = stop ? stop : new Date().getTime();
  let delta = parseFloat(time - start);

  // ms to years
  delta = delta / (1000 * 60 * 60 * 24 * 365);
  return delta;
};

// Dynamic list of skills.
const skills = [
  { type: 'Java', personal: 8, professional: 0 },
  { type: 'HTML5', personal: since(1262325600000), professional: since(1372654800000) },
  { type: 'SQL', personal: since(1262325600000, 1425189600000), professional: since(1372654800000, 1425189600000) },
  { type: 'CSS3', personal: since(1262325600000), professional: since(1372654800000) },
  { type: 'JavaScript', personal: since(1343797200000), professional: since(1393653600000) },
  { type: 'React.js', personal: since(1546322400000), professional: since(1546322400000) },
  { type: 'TypeScript', personal: since(1609480800000), professional: since(1546322400000) },
  { type: 'Node.js', personal: since(1420092000000), professional: since(1430456400000) },
  { type: 'UNIX', personal: since(1343797200000), professional: since(1372654800000) },
  { type: 'PHP', personal: since(1262325600000, 1425189600000), professional: since(1372654800000, 1425189600000) },
  { type: 'Git', personal: since(1343797200000), professional: since(1393653600000) },
  { type: 'MongoDB', personal: since(1393653600000), professional: since(1393653600000) },
  { type: 'Redis', personal: since(1393653600000), professional: since(1393653600000) },
].sort((first, second) => {
  if (first.professional == second.professional) {
    return 0;
  }

  return first.professional > second.professional ? -1 : 1;
});

// On page load create out Chart.
window.onload = () => {
  new Chartist.Line(
    '.ct-chart',
    {
      labels: skills.map((s) => s.type),
      series: [skills.map((s) => s.personal), skills.map((s) => s.professional)],
    },
    {
      low: 0,
      showArea: true,
      axisY: {
        offset: 80,
        labelInterpolationFnc: (value) => `${value} Years`,
      },
    }
  );
};
