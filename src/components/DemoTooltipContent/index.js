import React, { PropTypes } from 'react';
import styles from './styles.css';
import { getFormattedDate } from '../../utils/demoUtils';

const DemoTooltipContent = ({ point: { date, payload } }) => (
  <div className={styles.root}>
    <div className={styles.date}>
      {getFormattedDate(date)}
    </div>
    <div className={styles.payload}>
      <span>$ {payload.$d}</span>
      <span className={styles.delta}>
        <span className={styles.triangle} /> {payload.delta}
      </span>
    </div>
  </div>
);

DemoTooltipContent.propTypes = {
  point: PropTypes.object,
};

export default DemoTooltipContent;
