import React, { Component, MouseEvent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon';
import PropsType from './PropsType';

const Style = {
  iconStyle: { marginLeft: '8px', cursor: 'pointer' },
};

class Tag extends Component<PropsType, any> {
  static defaultProps = {
    theme: '',
    prefixCls: 'zw-tag',
    size: '',
    onClick: () => {},
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    theme: PropTypes.string,
    size: PropTypes.oneOf(['', 'large', 'middle', 'small', 'xsmall']),
    shape: PropTypes.oneOf(['', 'rect', 'radius', 'round']),
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    ghost: PropTypes.bool,
  };

  render() {
    const {
      prefixCls,
      theme,
      size,
      shape,
      className,
      onClose,
      onClick,
      closable,
      children,
      style,
      title,
    } = this.props;
    const classes = classnames(prefixCls, className, {
      [`${prefixCls}--${theme}`]: theme,
      [`${prefixCls}--${size}`]: size,
      [`${prefixCls}--${shape}`]: shape,
    });

    const closeIcon = closable ? (
      <Icon
        style={Style.iconStyle}
        type="wrong"
        onClick={(e: MouseEvent) => { onClose && onClose(e); }}
      />
    ) : null;
    return (
      <div className={classes} style={style} title={title} onClick={(e: MouseEvent) => { onClick && onClick(e); }}>
        { children }
        { closeIcon }
      </div>
    );
  }
}

export default Tag;
