import React, { PropTypes } from 'react';
import { cx } from '../utils';
import styles from './styles.css';

const PointHelper = ({ active, x1, x2, y1, y2, className, ...otherProps }) => (
  <g className={cx(styles.root, active && styles.active, className)}>
    <line
      fill="none"
      className={styles.inner}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />
    <line
      fill="none"
      className={styles.wrapper}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      {...otherProps}
    />
  </g>
);

PointHelper.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
};

PointHelper.defaultProps = {
  active: false,
};

export default PointHelper;
