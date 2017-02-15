import React, { PropTypes } from 'react';
import { cx, range } from '../utils';
import styles from './styles.css';

const Grid = (props) => {
  const {
    noVertical,
    noHorizontal,
    className,
    minX,
    maxX,
    minY,
    maxY,
    ySegments,
    calcXOnChart,
    calcYOnChart,
  } = props;

  const gridX = !noVertical ? range(maxX, minX).map(xi => (
    <line
      key={`grid-x-${xi}`}
      x1={calcXOnChart(xi)}
      y1={calcYOnChart(minY)}
      x2={calcXOnChart(xi)}
      y2={calcYOnChart(maxY)}
    />
  )) : null;

  const gridY = !noHorizontal ? range(maxY, minY, Math.floor(maxY / ySegments)).map(yi => (
    <line
      key={`grid-y-${yi}`}
      x1={calcXOnChart(minX)}
      y1={calcYOnChart(yi)}
      x2={calcXOnChart(maxX)}
      y2={calcYOnChart(yi)}
    />
  )) : null;

  return (
    <g className={cx(styles.root, className)}>
      {gridX}
      {gridY}
    </g>
  );
};

Grid.propTypes = {
  noVertical: PropTypes.bool,
  noHorizontal: PropTypes.bool,
  className: PropTypes.string,
  minX: PropTypes.number,
  maxX: PropTypes.number,
  minY: PropTypes.number,
  maxY: PropTypes.number,
  ySegments: PropTypes.number,
  calcXOnChart: PropTypes.func,
  calcYOnChart: PropTypes.func,
};

Grid.defaultProps = {
  noVertical: false,
  noHorizontal: false,
};

export default Grid;
