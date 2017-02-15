import React, { PropTypes } from 'react';
import { cx } from '../utils';
import styles from './styles.css';

const Point = ({ active, fill, noVisible, activeRadius, className, x, y, radius, ...otherProps }) => (
  <circle
    cx={x}
    cy={y}
    fill={noVisible && !active ? 'transparent' : fill}
    r={active ? activeRadius : radius}
    className={cx(styles.root, active && styles.active, className)}
    {...otherProps}
  />
);

Point.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  noVisible: PropTypes.bool,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number,
  activeRadius: PropTypes.number,
};

Point.defaultProps = {
  radius: 2,
  activeRadius: 4,
  active: false,
  noVisible: false,
};

export default Point;
