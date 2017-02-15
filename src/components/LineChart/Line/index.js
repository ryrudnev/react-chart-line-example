import React, { PropTypes } from 'react';
import { cx, sortByPosition } from '../utils';
import styles from './styles.css';
import Point from '../Point';
import PointHelper from '../PointHelper';

const Line = (props) => {
  /* eslint-disable no-unused-vars */
  const {
    className,
    calcXOnChart,
    calcYOnChart,
    noSorted,
    noPoints,
    noVisiblePoints,
    activePoint,
    noYHelper,
    noXHelper,
    data,
    maxX,
    minX,
    minY,
    maxY,
    dataSet,
    onMouseEnter,
    onMouseLeave,
    stroke,
    ...otherProps,
  } = props;
  /* eslint-enable no-unused-vars */

  const orderedData = noSorted ? data : [...data].sort(sortByPosition);

  let pathD;
  if (orderedData.length > 0) {
    const { x: x0, y: y0 } = data[0];

    pathD = orderedData.reduce((path, { x, y }) => (
      path + 'L ' + calcXOnChart(x) + ' ' + calcYOnChart(y) + ' '
    ), 'M ' + calcXOnChart(x0) + ' ' + calcYOnChart(y0) + ' ');
  }

  let points;
  if (!noPoints) {
    points = orderedData.map((point) => (
      <Point
        key={`point-${point.x}-${point.y}`}
        active={activePoint === point}
        noVisible={noVisiblePoints}
        x={calcXOnChart(point.x)}
        y={calcYOnChart(point.y)}
        fill={stroke}
        onMouseEnter={() => onMouseEnter(point)}
        onMouseLeave={() => onMouseLeave(point)}
      />
    ));
  }

  const yHelpers = !noYHelper ? orderedData.map((point) => (
    <PointHelper
      key={`helper-y-${point.x}-${point.y}`}
      active={activePoint === point}
      x1={calcXOnChart(minX)}
      y1={calcYOnChart(point.y)}
      x2={calcXOnChart(point.x)}
      y2={calcYOnChart(point.y)}
      onMouseEnter={() => onMouseEnter(point)}
      onMouseLeave={() => onMouseLeave(point)}
    />
  )) : null;

  const xHelpers = !noXHelper ? orderedData.map((point) => (
    <PointHelper
      key={`helper-x-${point.x}-${point.y}`}
      active={activePoint === point}
      x1={calcXOnChart(point.x)}
      y1={calcYOnChart(minY)}
      x2={calcXOnChart(point.x)}
      y2={calcYOnChart(point.y)}
      onMouseEnter={() => onMouseEnter(point)}
      onMouseLeave={() => onMouseLeave(point)}
    />
  )) : null;

  return (
    <g className={cx(styles.root, className)}>
      <path className={styles.path} d={pathD} fill="none" stroke={stroke} {...otherProps} />
      <g className={styles.yHelpers}>
        {yHelpers}
      </g>
      <g className={styles.xHelpers}>
        {xHelpers}
      </g>
      <g className={styles.points}>
        {points}
      </g>
    </g>
  );
};

Line.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  })).isRequired,
  className: PropTypes.string,
  calcXOnChart: PropTypes.func,
  calcYOnChart: PropTypes.func,
  noSorted: PropTypes.bool,
  noPoints: PropTypes.bool,
  noVisiblePoints: PropTypes.bool,
  noXHelper: PropTypes.bool,
  noYHelper: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  activePoint: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

Line.defaultProps = {
  noSorted: false,
  noPoints: false,
  noVisiblePoints: false,
  noXHelper: false,
  noYHelper: false,
};

export default Line;
