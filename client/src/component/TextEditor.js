import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  editable: {
    display: 'block',
    fontWeight: '300',
    width: '100%',
    padding: '1rem',
    borderRadius: '3px',
    resize: 'none',
    overflow: 'auto'
  },
  count: {
    font: '13px/1.5 monospace',
    marginTop: '10px'
  }
}));

const TextEditor = props => {
  const classes = useStyles();
  const { textLimit, value, onChange, disabled = false } = props;

  const textInputHandler = React.useCallback(
    e => {
      const text = e.target.value;
      if (text.length <= textLimit) {
        if (onChange) {
          onChange(text);
        }
      }
    },
    [textLimit, onChange]
  );

  const keyDownHandler = React.useCallback(e => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      <Typography
        placeholder="Enter title (optional)"
        onChange={textInputHandler}
        className={classes.editable}
        value={value}
        component="textarea"
        onKeyDown={keyDownHandler}
        disabled={disabled}
      ></Typography>
      <div className={classes.count}>
        <span>{value.length}</span> / <span>{textLimit}</span>
      </div>
    </div>
  );
};

TextEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  textLimit: PropTypes.number.isRequired
};

TextEditor.defaultProps = {
  textLimit: 120
};

export default TextEditor;
