import React, { PropTypes, PureComponent } from 'react';
import invariant from 'invariant';
import { cx, isEqualChildren, findChildrenByType, createChainedFunction } from '../utils';
import styles from './styles.css';
import Line from '../Line';
import XAxis from '../XAxis';
import YAxis from '../YAxis';
import Grid from '../Grid';
import Tooltip from '../Tooltip';

export default class LineChart extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    preserveAspectRatio: PropTypes.string,
  }

  static defaultProps = {
    width: 500,
    height: 300,
    preserveAspectRatio: 'xMidYMid meet',
  }

  constructor(props) {
    super(props);

    this.state = {
      ...this.getStateByChartElements(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { children, height, width } = this.props;

    const needUpdateState = nextProps.height !== height ||
      nextProps.width !== width || !isEqualChildren(children, nextProps.children);

    if (needUpdateState) {
      this.setState({
        ...this.getStateByChartElements(nextProps),
      });
    }
  }

  // Calculate x coordinate on chart
  calcXOnChart = (x) => {
    const { width } = this.props;
    const { maxX, noLabels, labelWidth } = this.state;
    const margin = (!noLabels ? labelWidth * 2 : 0);
    return (x / maxX * (width - margin));
  }

  // Calculate y coordinate on chart
  calcYOnChart = (y) => {
    const { height } = this.props;
    const { maxY, noLabels, labelHeight, xlegend } = this.state;
    const lh = xlegend ? labelHeight * 2 : labelHeight;
    const heightWithoutLabels = height - (!noLabels ? lh : 0);
    return heightWithoutLabels - (y / maxY * heightWithoutLabels);
  }

  getValidAxes(props) {
    const { children } = props;

    const xAxis = findChildrenByType(children, XAxis);
    const yAxis = findChildrenByType(children, YAxis);

    invariant(
      xAxis.length === 1,
      'You must specify the only one x-axis',
    );

    invariant(
      yAxis.length === 1,
      'You must specify the only one y-axis',
    );

    return {
      xAxis: xAxis[0],
      yAxis: yAxis[0],
    };
  }

  getChartElementsProps() {
    const { dataSet, minX, maxX, minY, maxY } = this.state;

    return {
      minX, maxX, minY, maxY,
      dataSet,
      calcYOnChart: this.calcYOnChart,
      calcXOnChart: this.calcXOnChart,
    };
  }

  getStateByChartElements(props) {
    const { children } = props;

    const { yAxis, xAxis } = this.getValidAxes(props);

    const {
      segments: ySegments,
      noLabels: yNoLabels,
    } = yAxis.props;

    const {
      noLabels: xNoLabels,
      labelWidth,
      labelHeight,
      legend: xlegend,
    } = xAxis.props;

    const lines = findChildrenByType(children, Line);

    // calc max and min chart coordinates
    const {
      dataSet = [],
      minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0,
    } = lines.reduce((acc, line) => {
      const { data } = line.props;
      if (!data.length) {
        return acc;
      }
      const { x: x0 } = data[0];
      const { minX = x0, maxX = 0, maxY = 0, dataSet = [] } = acc;

      const xd = data.map(({ x }) => x);
      const yd = data.map(({ x, y }) => y);

      return {
        dataSet: [...dataSet, data],
        minX: Math.min(minX, ...xd),
        maxX: Math.max(maxX, ...xd),
        maxY: Math.max(maxY, ...yd),
      };
    }, {});

    return {
      lines,
      dataSet,
      // extremum
      minY,
      minX,
      maxX,
      maxY: Math.ceil(maxY / ySegments) * ySegments,
      // x axes
      xAxis,
      xNoLabels,
      labelWidth,
      labelHeight,
      xlegend,
      // y axes
      yAxis,
      yNoLabels,
      ySegments,
      noLabels: xNoLabels && yNoLabels && !xlegend,
    };
  }

  handleLineMouseEnter = (point) => {
    this.setState({ activePoint: point });
  }

  handleLineMouseLeave = () => {
    this.setState({ activePoint: null });
  }

  renderXAxis() {
    const { xAxis } = this.state;

    if (!xAxis) {
      return null;
    }

    const axisProps = {
      key: 'x-axis',
      ...this.getChartElementsProps(),
    };

    return React.cloneElement(xAxis, axisProps);
  }

  renderYAxis() {
    const { yAxis, ySegments } = this.state;

    if (!yAxis) {
      return null;
    }

    const axisProps = {
      key: 'y-axis',
      ySegments,
      ...this.getChartElementsProps(),
    };

    return React.cloneElement(yAxis, axisProps);
  }

  renderGrid() {
    const { children } = this.props;
    const { ySegments } = this.state;

    const grid = findChildrenByType(children, Grid)[0];

    if (!grid) {
      return null;
    }

    return React.cloneElement(grid, {
      key: 'grid',
      ...this.getChartElementsProps(),
      ySegments,
    });
  }

  renderLines() {
    const { lines, activePoint } = this.state;

    return lines.map((line, i) => React.cloneElement(line, {
        key: `line-${i}`,
        activePoint,
        onMouseEnter: createChainedFunction(
          this.handleLineMouseEnter,
          line.props.onMouseEnter,
        ),
        onMouseLeave: createChainedFunction(
          this.handleLineMouseLeave,
          line.props.onMouseLeave,
        ),
        ...this.getChartElementsProps(),
      })
    );
  }

  renderTooltip() {
    const { children } = this.props;
    const { activePoint, labelWidth, labelHeight, noLabels } = this.state;

    const tooltip = findChildrenByType(children, Tooltip)[0];

    if (!tooltip || !activePoint) {
      return null;
    }

    return React.cloneElement(tooltip, {
      key: 'tooltip',
      point: activePoint,
      labelWidth,
      labelHeight,
      noLabels,
      ...this.getChartElementsProps(),
    });
  }

  render() {
    const { width, height, preserveAspectRatio, className } = this.props;
    const { noLabels, labelWidth } = this.state;

    const classes = cx(styles.root, !noLabels && styles.rootWithPadding, className);

    return (
      <span className={classes} style={{ width }}>
        <svg
          height={height}
          width={width}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio={preserveAspectRatio}
        >
          <g transform={`translate(${!noLabels ? labelWidth : 0}, 0)`}>
            {this.renderYAxis()}
            {this.renderXAxis()}
            {this.renderGrid()}
            {this.renderLines()}
          </g>
        </svg>
        {this.renderTooltip()}
      </span>
    );
  }
}
