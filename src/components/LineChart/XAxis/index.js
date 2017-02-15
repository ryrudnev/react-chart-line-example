import React, { PropTypes } from 'react';
import { cx, range } from '../utils';
import AxisLabel from '../AxisLabel';
import styles from './styles.css';

const XAxis = (props) => {
  const {
    minX,
    minY,
    maxX,
    noLabels,
    noLine,
    format,
    calcXOnChart,
    calcYOnChart,
    step,
    dataSet,
    labelHeight,
    legend,
    className,
    ...labelProps
  } = props;

  let labels;
  let legendLabel;

  if (!noLabels) {
    const xd = step > 0
      ? range(Math.ceil(maxX), Math.floor(minX), step)
      : dataSet.reduce((acc, data) => ([...acc, ...data.map(({ x }) => x)]), []);

    let x0;

    labels = xd.reduce((acc, x) => {
      const label = format(x);
      if (label == null || label === false) {
        return acc;
      }

      if (!x0) {
        x0 = x;
      }

      return [
        ...acc,
        <AxisLabel
          key={`x-axis-label-${x}`}
          transform={`translate(${calcXOnChart(x)},${calcYOnChart(0)})`}
          textTransform={`translate(0, ${labelHeight})`}
          textAnchor="middle"
          label={label}
          {...labelProps}
        />
      ];
    }, []);

    legendLabel = legend ? (<AxisLabel
      transform={`translate(${calcXOnChart(x0 || 0)},${calcYOnChart(0)})`}
      textTransform={`translate(0, ${x0 == null ? labelHeight : labelHeight * 2})`}
      textAnchor="middle"
      noPoints
      label={legend}
    />) : null;
  } else if (legend) {
    legendLabel = (<AxisLabel
      transform={`translate(${calcXOnChart(0)},${calcYOnChart(0)})`}
      textTransform={`translate(0, ${labelHeight})`}
      textAnchor="middle"
      noPoints
      label={legend}
    />);
  }

  return (
    <g className={cx(styles.root, className)}>
      {
        !noLine && <line
          x1={calcXOnChart(minX)}
          y1={calcYOnChart(minY)}
          x2={calcXOnChart(maxX)}
          y2={calcYOnChart(minY)}
        />
      }
      <g className={styles.labels}>
        {labels}
      </g>
      <g className={styles.legend}>
        {legendLabel}
      </g>
    </g>
  );
};

XAxis.propTypes = {
  noLabels: PropTypes.bool,
  noLine: PropTypes.bool,
  labelWidth: PropTypes.number,
  labelHeight: PropTypes.number,
  className: PropTypes.string,
  minX: PropTypes.number,
  maxX: PropTypes.number,
  minY: PropTypes.number,
  maxY: PropTypes.number,
  format: PropTypes.func,
  calcXOnChart: PropTypes.func,
  calcYOnChart: PropTypes.func,
  step: PropTypes.number,
  dataSet: PropTypes.array,
  legend: PropTypes.node,
};

XAxis.defaultProps = {
  noLabels: false,
  noLine: false,
  labelWidth: 40,
  labelHeight: 20,
  legend: '',
  format: x => x,
};

export default XAxis;
