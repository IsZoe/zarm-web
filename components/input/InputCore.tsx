import React, { Component } from 'react';
import classnames from 'classnames';
import { InputCoreProps } from './PropsType';
import Icon from '../icon';

export interface InputState {
  value: any;
  focused: boolean;
  inputStyle: React.CSSProperties | null;
}

export function fixControlledValue(value: string | number | null | undefined) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return String(value);
}

class Input extends Component<InputCoreProps, InputState> {
  static defaultProps = {
    prefixCls: 'zw-input',
    type: 'text',
    size: 'md',
    shape: 'radius',
    bordered: true,
    clearable: false,
  };

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  inputRef = React.createRef<HTMLInputElement>();

  prefixNodeRef = React.createRef<HTMLSpanElement>();

  suffixNodeRef = React.createRef<HTMLSpanElement>();

  constructor(props) {
    super(props);
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    this.state = {
      value,
      focused: false,
      inputStyle: null,
    };
  }

  componentDidMount() {
    this.setInputStyleWithPrefixOrSuffix();
  }

  setInputStyleWithPrefixOrSuffix() {
    const { size, clearable, bordered } = this.props;
    const inputStyle: React.CSSProperties = {};
    const clearIconWidth = 14 + 2;
    const sizeMap = {
      lg: 40,
      md: 32,
      sm: 24,
    };
    if (this.prefixNodeRef.current) {
      inputStyle.paddingLeft = this.prefixNodeRef.current.offsetWidth + sizeMap[size!] / 2;
    }
    if (this.suffixNodeRef.current) {
      inputStyle.paddingRight = this.suffixNodeRef.current.offsetWidth + sizeMap[size!] / 2
        + (clearable ? clearIconWidth : 0);
    }
    this.setState({ inputStyle: bordered === 'underline' ? null : inputStyle });
  }

  getInputCls = () => {
    const { prefixCls, className, size, shape, disabled, bordered, readOnly } = this.props;
    return classnames(prefixCls, className, {
      [`${prefixCls}--${size}`]: size,
      [`${prefixCls}--${shape}`]: shape,
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--readOnly`]: readOnly,
      [`${prefixCls}--underline`]: bordered === 'underline',
      [`${prefixCls}--bordered`]: bordered === true,
      [`${prefixCls}--nobordered`]: bordered === false,
    });
  };

  handleReset = (e) => {
    const { onChange } = this.props;
    const inputNode = this.inputRef.current;

    e.persist();
    this.setState({ value: '' }, () => {
      if (onChange) {
        if (inputNode) {
          let event = e;
          event = Object.create(e);
          event.target = inputNode;
          event.currentTarget = inputNode;
          const originalInputValue = inputNode.value;
          inputNode.value = '';
          onChange(event);
          inputNode.value = originalInputValue;
        }
      }
      inputNode!.focus();
    });
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    this.setState({ value: e.target.value });
    if (onChange) {
      onChange(e);
    }
  };

  onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(event);
    }
    this.setState({
      focused: true,
    });
  };

  onBlur = (event: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(event);
    }
    this.setState({
      focused: false,
    });
  };

  renderClearIcon = () => {
    const { prefixCls, clearable, disabled } = this.props;
    const { value } = this.state;
    if (!clearable || disabled || value === undefined || value === null || value === '') {
      return null;
    }
    return (
      <Icon
        type="wrong-round-fill"
        theme="default"
        className={`${prefixCls}__clear-icon`}
        role="button"
        onClick={this.handleReset}
      />
    );
  };

  renderSuffix = () => {
    const { prefixCls, suffix, clearable } = this.props;

    if (suffix || clearable) {
      return (
        <span className={`${prefixCls}__suffix`}>
          {this.renderClearIcon()}
          {suffix}
        </span>
      );
    }

    return null;
  };

  renderOriginalInput = () => {
    const {
      prefixCls,
      defaultValue,
      shape,
      size,
      className,
      style,
      disabled,
      readOnly,
      prefix,
      suffix,
      bordered,
      addonBefore,
      addonAfter,
      clearable,
      onFocus,
      onBlur,
      ...others
    } = this.props;
    const { value } = this.state;

    return (
      <input
        {...others as React.HtmlHTMLAttributes<HTMLInputElement>}
        ref={this.inputRef}
        className={`${prefixCls}__inner`}
        disabled={disabled}
        onChange={this.handleChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        value={fixControlledValue(value)}
      />
    );
  };

  renderBaseInput = () => {
    const {
      prefixCls,
      size,
      style,
      readOnly,
    } = this.props;
    const { value } = this.state;
    const cls = this.getInputCls();

    return !readOnly ? (
      <div className={cls} style={style}>
        {this.renderOriginalInput()}
      </div>
    ) : (
      <div className={`${prefixCls}--readOnly ${prefixCls}--${size}`}>
        {fixControlledValue(value)}
      </div>
    );
  };

  renderLabeledIconInput = () => {
    const {
      prefixCls,
      style,
      size,
      className,
      prefix,
      suffix,
      clearable,
      readOnly,
      bordered,
    } = this.props;
    const { value, focused, inputStyle } = this.state;

    if (!prefix && !suffix && !clearable && bordered !== 'underline') {
      return this.renderBaseInput();
    }

    const prefixNode = prefix ? (
      <span className={`${prefixCls}__prefix`} ref={this.prefixNodeRef}>{prefix}</span>
    ) : null;
    const suffixNode = (suffix || clearable) ? (
      <span className={`${prefixCls}__suffix`} ref={this.suffixNodeRef}>
        {this.renderClearIcon()}
        {suffix}
      </span>
    ) : null;
    const underlineNode = (bordered === 'underline' && !readOnly) ? (
      <div>
        <div className={`${prefixCls}__line`} />
        <div className={`${prefixCls}__focus-line`} />
      </div>
    ) : null;
    const cls = classnames(className, prefixCls, {
      [`${prefixCls}--${size}`]: size,
      [`${prefixCls}--underline`]: bordered === 'underline',
      [`${prefixCls}--clearable`]: suffix && clearable && value,
      [`${prefixCls}--focused`]: focused,
    });

    return (
      <div className={cls} style={style}>
        {prefixNode}
        {React.cloneElement(this.renderOriginalInput(), {
          style: inputStyle,
        })}
        {suffixNode}
        {underlineNode}
      </div>
    );
  };

  renderLabeledInput = () => {
    const { addonBefore, addonAfter, prefixCls, style, size, shape } = this.props;
    if (!addonBefore && !addonAfter) {
      return this.renderLabeledIconInput();
    }

    const cls = classnames(prefixCls, {
      [`${prefixCls}--${size}`]: size,
      [`${prefixCls}--${shape}`]: shape,
      [`${prefixCls}--prepend`]: addonBefore,
      [`${prefixCls}--append`]: addonAfter,
    });
    const prependCls = classnames(`${prefixCls}__prepend`);
    const appendCls = classnames(`${prefixCls}__append`);
    const addonBeforeNode = addonBefore ? <span className={prependCls}>{addonBefore}</span> : null;
    const addonAfterNode = addonAfter ? <span className={appendCls}>{addonAfter}</span> : null;

    return (
      <div className={cls} style={style}>
        {addonBeforeNode}
        {React.cloneElement(this.renderOriginalInput(), { style: null })}
        {addonAfterNode}
      </div>
    );
  };

  render() {
    return this.renderLabeledInput();
  }
}

export default Input;
