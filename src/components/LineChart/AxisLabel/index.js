import React, { PropTypes } from 'react';
import { cx } from '../utils';
import styles from './styles.css';

const AxisLabel = ({
  label,
  transform,
  textTransform,
  noPoints,
  pointRadius,
  className,
  textAnchor,
}) => (
  <g
    className={cx(styles.root, className)}
    transform={transform}
  >
    {!noPoints ? <circle r={pointRadius} cx="0" cy="0" /> : null }
    <text transform={textTransform} textAnchor={textAnchor}>
      {label}
    </text>
  </g>
);

AxisLabel.propTypes = {
  label: PropTypes.node.isRequired,
  noPoints: PropTypes.bool,
  pointRadius: PropTypes.number,
  transform: PropTypes.string,
  textTransform: PropTypes.string,
  textAnchor: PropTypes.string,
  className: PropTypes.string,
};

AxisLabel.defaultProps = {
  noPoints: false,
  pointRadius: 2,
};

export default AxisLabel;
