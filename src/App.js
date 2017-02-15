import React, { Component } from 'react';

import { LineChart, Line, Grid, XAxis, YAxis, Tooltip } from './components/LineChart';
import DemoTooltipContent from './components/DemoTooltipContent';

import {
  getRandomInt,
  getRandomFloat,
  getDatesFromRange,
  getDayOfYear,
  createDateFromDay,
  monthMap,
  toUpperCaseFirst,
} from './utils/demoUtils';

const YEAR = 2015;
const dates = getDatesFromRange(new Date(YEAR, 0, 1), new Date(YEAR, 11, 31));

const data = [];

for (let i = 0; i < dates.length; i += getRandomInt(6, 12)) {
  data.push({
    x: getDayOfYear(dates[i]),
    y: getRandomInt(15, 80),
    date: dates[i],
    payload: {
      $d: getRandomFloat(45, 80),
      delta: getRandomFloat(0.1, 1),
    },
  });
}

const formatX = (day) => {
  const date = createDateFromDay(YEAR, day);
  return date.getUTCDate() === 15
    ? <tspan>{toUpperCaseFirst(monthMap[date.getMonth()])}</tspan>
    : null;
};

class App extends Component {
  render() {
    return (
      <div>
        <LineChart width={900} height={500}>
          <Grid noVertical />
          <YAxis noPoints noLine segments={4} />
          <XAxis step={1} noPoints format={formatX} legend={YEAR} />
          <Line noVisiblePoints noYHelper data={data} stroke="#7099c0" />
          <Tooltip content={<DemoTooltipContent />} />
        </LineChart>
      </div>
    );
  }
}

export default App;
