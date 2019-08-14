'use strict';

/**
 * Get the total time of exp from the given start time to now. Used for skills currently in use.
 *
 * @param start {Number}
 *   The time this skill was acquired.
 * @param stop {Number} optional
 *   The time this skill was no longer being used (EPOCH in ms).
 */
var timeFrom = function(start, stop) {
  var time = stop ? stop : (new Date()).getTime();
  var delta = parseFloat(time - start);

  // ms to years
  delta = delta / (1000 * 60 * 60 * 24 * 365);
  return delta;
};

// Dynamic list of skills.
var skills = _.sortByOrder([
  {type: 'Java', personal: 8, professional: 0},
  {type: 'HTML5', personal: timeFrom(1262325600000), professional: timeFrom(1372654800000)},
  {type: 'SQL', personal: timeFrom(1262325600000, 1425189600000), professional: timeFrom(1372654800000, 1425189600000)},
  {type: 'CSS3', personal: timeFrom(1262325600000), professional: timeFrom(1372654800000)},
  {type: 'JavaScript', personal: timeFrom(1343797200000), professional: timeFrom(1393653600000)},
  {type: 'Node.js', personal: timeFrom(1420092000000), professional: timeFrom(1430456400000)},
  {type: 'UNIX', personal: timeFrom(1343797200000), professional: timeFrom(1372654800000)},
  {type: 'PHP', personal: timeFrom(1262325600000, 1425189600000), professional: timeFrom(1372654800000, 1425189600000)},
  {type: 'Git', personal: timeFrom(1343797200000), professional: timeFrom(1393653600000)},
  {type: 'MongoDB', personal: timeFrom(1393653600000), professional: timeFrom(1393653600000)},
  {type: 'Redis', personal: timeFrom(1393653600000), professional: timeFrom(1393653600000)}
], ['professional'], ['desc']);

// On page load, register scroll events and create out Chart.
window.onload = function() {
  var navHeight = $('nav').height();
  var paddingHeight = parseInt($('.content').css('padding-top').split('p')[0]);
  var scrollOffset = Math.abs(paddingHeight - navHeight);

  // Hack for small-width devices, to fix nav height issues, due to dynamic DOM elements.
  if ($(window).width() < 728) {
    scrollOffset = Math.abs(paddingHeight + navHeight);
  }

  new Chartist.Line('.ct-chart', {
    labels: _.pluck(skills, 'type'),
    series: [
      _.pluck(skills, 'personal'),
      _.pluck(skills, 'professional')
    ]
  }, {
    low: 0,
    showArea: true,
    axisY: {
      offset: 80,
      labelInterpolationFnc: function(value) {
        return value + ' Years'
      }
    }
  });
};
