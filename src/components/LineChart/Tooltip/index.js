import React, { PropTypes, PureComponent } from 'react';
import { cx } from '../utils';
import styles from './styles.css';

export default class Tooltip extends PureComponent {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    point: PropTypes.object,
    xOffset: PropTypes.number,
    yOffset: PropTypes.number,
    labelWidth: PropTypes.number,
    labelHeight: PropTypes.number,
    className: PropTypes.string,
    calcXOnChart: PropTypes.func,
    calcYOnChart: PropTypes.func,
  }

  static defaultProps = {
    xOffset: 4,
    yOffset: 14,
  }

  state = {
    contentWidth: null,
    contentHeight: null,
  }

  componentDidMount() {
    this.updateContent();
  }

  componentDidUpdate() {
    this.updateContent();
  }

  updateContent() {
    if (this.contentNode && this.contentNode.getBoundingClientRect) {
      const contentBox = this.contentNode.getBoundingClientRect();

      this.setState({
        contentWidth: contentBox.width,
        contentHeight: contentBox.height,
      });
    }
  }

  renderContent(content, props) {
    if (React.isValidElement(content)) {
      return React.cloneElement(content, props);
    } else if (typeof content === 'function') {
      return content(props);
    }
    return null;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      point,
      calcXOnChart,
      calcYOnChart,
      className,
      minX,
      minY,
      maxX,
      maxY,
      xOffset,
      yOffset,
      labelWidth,
      labelHeight,
      noLabels,
      dataSet,
      content,
      ...otherProps,
    } = this.props;
    /* eslint-enable no-unused-vars */

    const {
      contentWidth,
      contentHeight,
    } = this.state;

    const outerStyle = {};

    if (contentWidth != null && contentHeight != null) {
      const x = calcXOnChart(point.x) + (!noLabels ? labelWidth : 0);
      const y = calcYOnChart(point.y) - contentHeight;

      const left = x + contentWidth + xOffset > calcXOnChart(maxX)
        ? x - contentWidth - xOffset
        : x + xOffset;

      const top = y - contentHeight < calcYOnChart(maxY)
        ? y + contentHeight + yOffset
        : y;

      outerStyle.left = left;
      outerStyle.top = top;
    } else {
      outerStyle.visibility = 'hidden';
    }

    return (
      <span
        className={cx(styles.root, className)}
        style={outerStyle}
        ref={node => { this.contentNode = node; }}
      >
        {this.renderContent(content, { point, ...otherProps })}
      </span>
    )
  }
}
