import React, { PropTypes } from 'react';
import { cx, range } from '../utils';
import AxisLabel from '../AxisLabel';
import styles from './styles.css';

const YAxis = (props) => {
  const {
    segments,
    format,
    noLabels,
    noLine,
    minX,
    minY,
    maxY,
    calcXOnChart,
    calcYOnChart,
    className,
    labelHeight,
    labelWidth,
    ...labelProps
  } = props;

  const labels = !noLabels ? range(maxY, 0, Math.floor(maxY / segments)).reduce((acc, y) => {
    const label = format(y);
    if (label == null || label === false) {
      return acc;
    }
    return [
      ...acc,
      <AxisLabel
        key={`y-axis-label-${y}`}
        transform={`translate(${calcXOnChart(minX)},${calcYOnChart(y)})`}
        textTransform={`translate(-${labelWidth}, ${labelHeight})`}
        textAnchor="end"
        label={label}
        {...labelProps}
      />
    ];
  }, []) : null;

  return (
    <g className={cx(styles.root, className)}>
      {
        !noLine && <line
          x1={calcXOnChart(minX)}
          y1={calcYOnChart(minY)}
          x2={calcXOnChart(minX)}
          y2={calcYOnChart(maxY)}
        />
      }
      <g className={styles.labels}>
        {labels}
      </g>
    </g>
  );
};

YAxis.propTypes = {
  segments: PropTypes.number,
  noLabels: PropTypes.bool,
  labelHeight: PropTypes.number,
  labelWidth: PropTypes.number,
  noLine: PropTypes.bool,
  className: PropTypes.string,
  minX: PropTypes.number,
  maxX: PropTypes.number,
  minY: PropTypes.number,
  maxY: PropTypes.number,
  calcXOnChart: PropTypes.func,
  calcYOnChart: PropTypes.func,
  format: PropTypes.func,
};

YAxis.defaultProps = {
  segments: 5,
  noLabels: false,
  labelHeight: 5,
  labelWidth: 10,
  noLine: false,
  format: y => y,
};

export default YAxis;
